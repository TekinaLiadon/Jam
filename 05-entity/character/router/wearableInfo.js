import getJson from "../../../utils/getJson.js";

export default {
    method: 'GET',
    url: '/api/wearableInfo',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const charJson = await getJson(connection, req.query.characterName, req.user)
        // переделать
        if (charJson) {
            try {
                const ability = await this.axios.get(process.env.GAMESYSTEM_URL + `/wearables/${req.query.wearableName}?with_snippets=true`)
                return reply.send({ability: ability.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: 'У вас нет такого предмета'})
    },
}