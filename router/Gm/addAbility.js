import roleList from "../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/addAbility',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return Promise.all([
            this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                JSON.stringify({
                    entity: req.body.entityName,
                    ability: req.body.abilityName,
                }), {
                    headers: {'Content-Type': 'application/json'},
                }
            ),
            connection.query(userRole, [req.user.id])
        ])
            .then((result) => {
                if (roleList[result[1][0].role]?.level >= 5) return reply.send({message: result[0].data.message})
                else return reply.code(403).send({message: 'Недостаточно прав'})
            })
            .catch((err) => {
                console.log(req.user)
                reply.code(500).send(err.response.data)
            })
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
                abilityName: {
                    type: 'string',
                },
            },
            required: ['entityName', 'abilityName'],
        }
    },
}