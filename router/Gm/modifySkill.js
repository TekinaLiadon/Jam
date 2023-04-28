import roleList from "../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/modifySkill',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return await connection.query(userRole, [req.user.id])
            .then((result) => {
                if (roleList[result[0].role]?.level >= 5) return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/mod_skill',
                    JSON.stringify({
                        entity: req.body.entityName,
                        modified_object: req.body.skillName,
                        mod: req.body.mod
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
                else return reply.code(403).send({message: 'Недостаточно прав'})
            })
            .then((result) => {
                return reply.send(result.data)
            })
            .catch((err) => reply.code(500).send(err))
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
                entityName: {
                    type: 'string',
                },
                skillName: {
                    type: 'string',
                },
                mod: {
                    type: 'string',
                },
            },
            required: ['entityName', 'skillName', 'mod'],
        }
    }
}