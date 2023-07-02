import getJson from "../../../utils/getJson.js";
export default {
    method: 'GET',
    url: '/api/partUpgradesInfo',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const charJson = await getJson(connection, req.query.characterName, req.user)
        if (charJson.parts.some((el) => Object.values(el)[0]?.bodypart?.upgrades.some((item) => item._id === req.query.partUpgrades))) {
            try {
                const partUpgrades = await this.axios.get(process.env.GAMESYSTEM_URL + `/items/part_upgrades/${req.query.partUpgrades}`)
                return reply.send({partUpgrades: partUpgrades.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: 'У вас нет такого абгрейда'})
    },
}