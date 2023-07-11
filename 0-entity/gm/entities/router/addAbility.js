import roleList from "../../../../enums/roleList.js";
import roleCheck from "../../../../utils/roleCheck.js";

export default {
    method: 'POST',
    url: '/api/addAbility',
    async handler(req, reply) {
        try {
            var connection = await this.mariadb.getConnection()
            var role = await roleCheck(connection, req.user.id)
            if (roleList[role]?.level < 5) return reply.code(403).send({text: 'Недостаточно прав'})
            var info = await this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
                JSON.stringify({
                    entity: req.body.entityName,
                    ability: req.body.abilityName,
                }), {
                    headers: {'Content-Type': 'application/json'},
                }
            )
            connection.release()
            return reply.send(info.data)
        } catch (e) {
            return reply.code(500).send(e?.response?.data || e)
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