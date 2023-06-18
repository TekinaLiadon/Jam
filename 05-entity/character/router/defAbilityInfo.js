import getJson from "../../../utils/getJson.js";
export default {
    method: 'GET',
    url: '/api/defAbilityInfo',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const charJson = await getJson(connection, req.query.characterName, req.user)
        if (charJson.abilities.def_abilities_list.some((el) => el.ability._id === req.query.abilityName)) {
            try {
                const ability = await this.axios.get(process.env.GAMESYSTEM_URL + `/def_abilities/${req.query.abilityName}`)
                return reply.send({ability: ability.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: 'У вас нет такой абилки'})
    },
}