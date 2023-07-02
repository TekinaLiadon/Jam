import getJson from "../../../utils/getJson.js";
export default {
    method: 'GET',
    url: '/api/entityUpgradesInfo',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const charJson = await getJson(connection, req.query.characterName, req.user)
        if (charJson.upgrades.some((el) => el === req.query.entityUpgrades)) {
            try {
                const entityUpgrades = await this.axios.get(process.env.GAMESYSTEM_URL + `/items/entity_upgrades/${req.query.entityUpgrades}`)
                return reply.send({entityUpgrades: entityUpgrades.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: 'У вас нет такого абгрейда'})
    },
}