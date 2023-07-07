import getJson from "../../utils/getJson.js";

export default async function handler(req, data, options){
    const connection = await options.mariadb.getConnection()
    const charJson = await getJson(connection, data.characterName, req.user)
    if (Object.keys(charJson).length === 0) return {text: 'Персонаж не найден'}
    const state = {
        energyShieldsInfo: charJson?.energy_shield?.item?._id === data.energyShields,
        trinketInfo: charJson?.trinkets?.some((el) => el.trinket._id === data.trinketName),
        clothesInfo: charJson?.clothes?.item?._id === data.clothesName,
        entityUpgradesInfo: charJson?.upgrades?.some((el) => el === data.entityUpgrades),
        partInfo: charJson.parts?.some((el) => el[data.partName]),
        partUpgradesInfo: charJson?.parts.some((el) => Object.values(el)[0]?.bodypart?.upgrades.some((item) => item._id === data.partUpgrades)),
        wearableInfo: () => {
            let isWearable = false; // переделать
            for (var i = 0; i < charJson.parts.length; i++) {
                if (Object.values(charJson?.parts[i])?.some((item) => item?.armor_element?.item?._id === data.wearableName)) {
                    isWearable = true
                    break
                }
            }
            return isWearable
        },
        holdableInfo: charJson?.main_item?.item?._id === data.holdable || charJson?.offhand_item?.item?._id === data.holdable,
    }
     if (state[options.type]) {
        try {
            const info = await options.axios.get(process.env.GAMESYSTEM_URL + options.url)
            return info.data
        } catch (e) {
            return {text: 'Ошибка Апи'}
        }
    }
    else return {text: options.err}
}