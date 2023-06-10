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
        let isWearable = false;
        for (var i = 0; i < charJson.parts.length; i++) {
            if (Object.values(charJson.parts[i])?.some((item) => item?.armor_element?.item?._id === req.query.wearableName)) {
                isWearable = true
                break
            }
        }
        if (isWearable) {
            try {
                const ability = await this.axios.get(process.env.GAMESYSTEM_URL + `/items/wearables/${req.query.wearableName}?with_snippets=true`)
                return reply.send({ability: ability.data})
            } catch (e) {
                return reply.code(403).send({text: 'Ошибка Апи'})
            }
        }
        else return reply.code(403).send({text: 'У вас нет такого предмета'})
    },
}