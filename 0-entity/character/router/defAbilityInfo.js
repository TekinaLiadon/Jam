
export default {
    method: 'GET',
    url: '/api/defAbilityInfo',
    async handler(req, reply) {
        const abilities = await this.axios.get(process.env.GAMESYSTEM_URL + `/integration/${req.query.characterName}/abilities`)
        if (abilities.data.def_abilities.some((el) => el === req.query.abilityName)) {
            try {
                const ability = await this.axios.get(process.env.GAMESYSTEM_URL + `/def_abilities/${req.query.abilityName}`)
                return reply.send({ability: ability.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: abilities.data.message})
    },
}