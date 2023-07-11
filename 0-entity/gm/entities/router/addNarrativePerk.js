import roleList from "../../../../enums/roleList.js";
import roleCheck from "../../../../utils/roleCheck.js";

export default {
    method: 'POST',
    url: '/api/addNarrativePerk',
    async handler(req, reply) {
        try {
            var connection = await this.mariadb.getConnection()
            var role = await roleCheck(connection, req.user.id)
            if (roleList[role]?.level < 5) return reply.code(403).send({text: 'Недостаточно прав'})
            var info = await this.axios.post(process.env.GAMESYSTEM_URL + '/characters/add_narrative_perk',
                JSON.stringify({
                    player: req.body.entityName,
                    perk_name: req.body.perkName,
                    perk_descritpion: req.body.description
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
                perkName: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
            },
            required: ['entityName', 'description', 'perkName'],
        }
    },
}