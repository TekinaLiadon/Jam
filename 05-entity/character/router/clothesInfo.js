import getJson from "../../../utils/getJson.js";
export default {
    method: 'GET',
    url: '/api/clothesInfo',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const charJson = await getJson(connection, req.query.characterName, req.user)
        if (charJson.clothes.item._id === req.query.clothesName) {
            try {
                const clothes = await this.axios.get(process.env.GAMESYSTEM_URL + `/items/clothes/${req.query.clothesName}?with_snippets=true`)
                return reply.send({clothes: clothes.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: 'У вас нет такой одежды'})
    },
}