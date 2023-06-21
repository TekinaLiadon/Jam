import getJson from "../../../utils/getJson.js";
export default {
    method: 'GET',
    url: '/api/partInfo',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const charJson = await getJson(connection, req.query.characterName, req.user)
        if (charJson.parts.some((el) => el[req.query.partName])) {
            try {
                const parts = await this.axios.get(process.env.GAMESYSTEM_URL + `/parts/${req.query.partName}`)
                return reply.send({parts: parts.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: 'У вас нет такой части тела'})
    },
}