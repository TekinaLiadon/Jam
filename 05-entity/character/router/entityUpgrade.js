import getJson from "../../../utils/getJson.js";
export default {
    method: 'GET',
    url: '/api/entityUpgradeInfo',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const charJson = await getJson(connection, req.query.characterName, req.user)
        if (charJson.trinkets.some((el) => el.trinket._id === req.query.trinketName)) {
            try {
                // переделать
                const trinket = await this.axios.get(process.env.GAMESYSTEM_URL + `/items/trinkets/${req.query.trinketName}?with_snippets=true`)
                return reply.send({trinket: trinket.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: 'У вас нет такого тринкета'})
    },
}