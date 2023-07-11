import roleList from "../../../../enums/roleList.js";
import roleCheck from "../../../../utils/roleCheck.js";

export default {
    method: 'GET',
    url: '/api/defAbilitiesList',
    async handler(req, reply) {
        try {
            var connection = await this.mariadb.getConnection()
            var role = await roleCheck(connection, req.user.id)
            if (roleList[role]?.level < 5) return reply.code(403).send({text: 'Недостаточно прав'})
            var info = await this.axios.get(process.env.GAMESYSTEM_URL + '/def_abilities', {
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