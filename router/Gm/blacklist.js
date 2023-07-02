import roleList from "../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/blacklist',
    async handler(req, reply) {
        // Надо еще обнулять роль на юзера
        var projectBan = `UPDATE ${process.env.ADDITIONAL_TABLE_NAME} SET blacklist = ? WHERE id = ?`
        var charactersBan = `UPDATE ${process.env.CHARACTER_TABLE_NAME} SET blacklist = ? WHERE id = ?`
        var userInfo = `SELECT id, role FROM ${process.env.CORE_TABLE_NAME} WHERE username = ? LIMIT 1`
        var roleCheck = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return await Promise.all([
            connection.query(userInfo, [req.body.username]),
            connection.query(roleCheck, [req.user.id]),
        ])
            .then((result) => {
                if (roleList[result[1][0].role]?.level <= roleList[result[0][0].role]?.level) throw {
                    message: 'Недостаточно прав',
                    codeErr: 403,
                }
                else if (roleList[result[1][0].role]?.level >= 5) return req.body.command === 'ban' ?
                    Promise.all([
                        connection.query(projectBan, [1, result[0][0].id]),
                        connection.query(charactersBan, [1, result[0][0].id]),
                    ]) :
                    connection.query(projectBan, [0, result[0][0].id])
                else throw {
                        message: 'Недостаточно прав',
                        codeErr: 403,
                    }
            })
            .then(() => {
                return reply.send({message: 'Пользователь забанен/разбанен'})
            })
            .catch((err) => reply.code(err?.codeErr || 500).send(err))
            .finally(() => connection.release())
    },
    schema: {
        response: {
            default: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
            200: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'success'
                    },
                }
            },
        },
        body: {
            type: 'object',
            properties: {
                command: {
                    type: 'string',
                },
                username: {
                    type: 'string',
                },
            },
            required: ['command', 'username'],
        }
    }
}