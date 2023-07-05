import roleList from "../../../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/addNarrativePerk',
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return Promise.all([
            this.axios.post(process.env.GAMESYSTEM_URL + '/characters/add_narrative_perk',
                JSON.stringify({
                    player: req.body.entityName,
                    perk_name: req.body.perkName,
                    perk_descritpion: req.body.description
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
            .catch((err) => reply.code(500).send(err.response.data))
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