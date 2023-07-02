import getJson from "../../../utils/getJson.js";
export default {
    method: 'GET',
    url: '/api/energyShieldsInfo',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const charJson = await getJson(connection, req.query.characterName, req.user)
        if (charJson.energy_shield.item._id === req.query.energyShields) {
            try {
                const energyShields = await this.axios.get(process.env.GAMESYSTEM_URL + `/items/energy_shields/${req.query.energyShields}?with_snippets=true`)
                return reply.send({energyShields: energyShields.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: 'У вас нет такого щита'})
    },
}