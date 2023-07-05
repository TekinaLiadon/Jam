import roleList from "../../../../enums/roleList.js";

export default {
    method: 'GET',
    url: '/api/abilitiesList',
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return await Promise.all([
            this.axios.get(process.env.GAMESYSTEM_URL + '/abilities', {
                    headers: {'Content-Type': 'application/json'},
                }
            ),
            connection.query(userRole, [req.user.id])
        ])
            .then((result) => {
                if (roleList[result[1][0].role]?.level >= 5) return reply.send(result[0].data)
                else return reply.code(403).send({text: 'Недостаточно прав'})
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
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                        uid: {
                            type: 'string',
                        },
                        name: {
                            type: 'string',
                        },
                        short_description: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        ability_type: {
                            type: 'string',
                        },
                        target_type: {
                            type: 'string',
                        },
                        roll_stat: {
                            type: 'string',
                        },
                        locational: {
                            type: 'boolean',
                        },
                        min_distance: {
                            type: 'number',
                        },
                        max_distance: {
                            type: 'number',
                        },
                        cooldown: {
                            type: 'number',
                        },
                        hidden: {
                            type: 'boolean',
                        },
                        consume_od: {
                            type: 'number',
                        },
                        consume_stamina: {
                            type: 'number',
                        },
                        consume_focus: {
                            type: 'number',
                        },
                        skill_req: {
                            type: 'object',
                            properties: {
                                HELITICS: {
                                    type: 'number',
                                },
                                REBORIA: {
                                    type: 'number',
                                },
                                SHAN_LIGIA: {
                                    type: 'number',
                                },
                                ELECTRODYNAMICS: {
                                    type: 'number',
                                },
                                VITAISM: {
                                    type: 'number',
                                },
                                PSINERGICS: {
                                    type: 'number',
                                },
                                ICHOROTEOLOGY: {
                                    type: 'number',
                                },
                                THEURGY: {
                                    type: 'number',
                                },
                                CATALYSTICS: {
                                    type: 'number',
                                },
                                COMBISTICS: {
                                    type: 'number',
                                },
                                DEMIPHYSICS: {
                                    type: 'number',
                                },
                                PHOTOKINETICS: {
                                    type: 'number',
                                },
                                BIOGENETICS: {
                                    type: 'number',
                                },
                                CYBERSYNTHETICS: {
                                    type: 'number',
                                },
                                points: {
                                    type: 'number',
                                },
                            }
                        },
                    },
                }
            },
        },
    },
}