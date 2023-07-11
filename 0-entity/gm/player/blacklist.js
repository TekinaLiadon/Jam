import roleList from "../../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/blacklist',
    async handler(req, reply) {
        if (req.body.apiKey !== '11') return reply.send({message: 'Неверный ключ'})
        try {
            var connection = await this.mariadb.getConnection()
            var updateBlacklist = `UPDATE ${process.env.ADDITIONAL_TABLE_NAME} SET blacklist = ? WHERE id = ?`
            var userId = await connection.query(`SELECT id FROM ${process.env.CORE_TABLE_NAME} WHERE discord_id = ? LIMIT 1`, [req.body.discordId])
            req.body.command === 'ban' ? await connection.query(updateBlacklist, [1, userId[0]?.id])
                : await connection.query(updateBlacklist, [0, userId[0]?.id])
            connection.release()
            return reply.send({message: 'Пользователь забанен/разбанен'})
        } catch (e) {
            return reply.code(520).send(e)
        }
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
                apiKey: {
                    type: 'string',
                },
                discordId: {
                    type: 'string'
                }
            },
            required: ['command', 'discordId', 'apiKey'],
        }
    }
}