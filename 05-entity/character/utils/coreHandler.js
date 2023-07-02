import getJson from "../../../utils/getJson.js";

export default async function handler(req, reply, options){
    const connection = await options.mariadb.getConnection()
    const charJson = await getJson(connection, req.query.characterName, req.user)
    const state = {
        energyShields: charJson?.energy_shield?.item._id === req.query.energyShields,
        trinket: charJson?.trinkets?.some((el) => el.trinket._id === req.query.trinketName),
    }
    if (state[options.type]) {
        try {
            const info = await options.axios.get(process.env.GAMESYSTEM_URL + options.url)
            return reply.send({info: info.data})
        } catch (e) {
            return reply.code(403).send({text: 'Ошибка Апи'})
        }
    }
    else return reply.code(403).send({text: options.err})
}