

export default {
    method: 'GET',
    url: '/api/characterInfo',
    async handler(req, reply) {
        await this.auth(req, reply)
        const connection = await this.mariadb.getConnection()
        var characterCheck = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id=? AND character_name=? LIMIT 1`
        return await Promise.all([
            this.axios.get(process.env.GAMESYSTEM_URL + `/entities/${req.query.characterName}`),
            connection
                .query(characterCheck, [req.user.id, req.query.characterName]),
        ])
            .then((result) => {
                if(result[1].length === 1) return  reply.send(result[0].data)
                else return reply.code(404).send({text: 'Данный персонаж не найден в списке персонажей'})
            })
            .catch((err) => {
                reply.code(500).send(err)
            })
    },
    /*schema: {
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
                    tags: {
                        type: 'array',
                    },
                    abilities: {
                        type: 'object',
                    },
                    statuses: {
                        type: 'array',
                    },
                    soul: {
                        type: 'number',
                    },
                    parts: {
                        type: 'object',
                    },
                    traits: {
                        type: 'array',
                    },
                    ties: {
                        type: 'object',
                    },
                    name: {
                        type: 'string',
                    },
                    display_name: {
                        type: 'string',
                    },
                    entity_type: {
                        type: 'string',
                    },
                    diseases: {
                        type: 'array',
                    },
                    stats: {
                        type: 'object',
                    },
                    skills: {
                        type: 'object',
                    },
                    attributes: {
                        type: 'object',
                    },
                    buffs: {
                        type: 'object',
                    },
                    blessings: {
                        type: 'object',
                    },
                    needs: {
                        type: 'object',
                    },
                    adaptation_embedded: {
                        type: 'object',
                    },
                    adaptation_resist: {
                        type: 'object',
                    },
                    adaptation_current: {
                        type: 'object',
                    },
                    cooldowns: {
                        type: 'object',
                    },
                    main_item: {
                        type: 'object',
                    },
                    offhand_item: {
                        type: 'object',
                    },
                    energy_shield: {
                        type: 'object',
                    },
                    trinkets: {
                        type: 'array',
                    },
                    clothes: {
                        type: 'object',
                    },
                    health_loss_fatigue: {
                        type: 'number',
                    },
                    is_alive: {
                        type: 'boolean',
                    },
                    oath: {
                        type: 'string',
                    },
                    small_milestone: {
                        type: 'number',
                    },
                    huge_milestone: {
                        type: 'boolean',
                    },
                    clues: {
                        type: 'array',
                    },
                    perks: {
                        type: 'array',
                    },
                    knowledge: {
                        type: 'object',
                    },
                    appearance: {
                        type: 'string',
                    },
                    current_appearance: {
                        type: 'string',
                    },
                    current_mood: {
                        type: 'string',
                    },
                    narrative_perks: {
                        type: 'object',
                    },
                    character: {
                        type: 'string',
                    },
                    thoughts: {
                        type: 'array',
                    },
                    infosphere_opinion: {
                        type: 'string',
                    },
                    gossips_to_give: {
                        type: 'number',
                    },
                    gossips: {
                        type: 'array',
                    },
                    techs: {
                        type: 'array',
                    },
                    status: {
                        type: 'string',
                        default: 'success'
                    }
                },
            },
            404: {
                type: 'object',
                properties: {
                    text: {
                        type: 'string',
                    },
                    code: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
        },
    },*/
}