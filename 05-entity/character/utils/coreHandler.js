import getJson from "../../../utils/getJson.js";

export default async function handler(req, reply, options){
    const connection = await options.mariadb.getConnection()
    const charJson = await getJson(connection, req.query.characterName, req.user)
    const state = {
        energyShields: charJson?.energy_shield?.item?._id === req.query.energyShields,
        trinket: charJson?.trinkets?.some((el) => el.trinket._id === req.query.trinketName),
        clothes: charJson?.clothes?.item?._id === req.query.clothesName,
        entityUpgrades: charJson?.upgrades?.some((el) => el === req.query.entityUpgrades),
        part: charJson.parts?.some((el) => el[req.query.partName]),
        partUpgrades: charJson?.parts.some((el) => Object.values(el)[0]?.bodypart?.upgrades.some((item) => item._id === req.query.partUpgrades)),
        wearable: () => {
            let isWearable = false; // переделать
            for (var i = 0; i < charJson.parts.length; i++) {
                if (Object.values(charJson?.parts[i])?.some((item) => item?.armor_element?.item?._id === req.query.wearableName)) {
                    isWearable = true
                    break
                }
            }
            return isWearable
        },
        holdable: charJson?.main_item?.item?._id === req.query.holdable || charJson?.offhand_item?.item?._id === req.query.holdable,
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