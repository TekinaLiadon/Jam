import registration from './Auth/registration.js'
import login from './Auth/login.js'
import tokenDiscord from "./Auth/tokenDiscord.js";
import loginDiscord from "./Auth/loginDiscord.js";
import loadSkin from "./Character/loadSkin.js";
import createCharacter from "./Character/createCharacter.js";
import charactersList from "./Character/charactersList.js";
import characterInfo from "./Character/characterInfo.js";
import changeRole from "./Gm/changeRole.js";
import addAbility from "../0-entity/gm/entities/router/addAbility.js";
import abilitiesList from "../0-entity/gm/entities/router/abilitiesList.js";
import modifyAttribute from "../0-entity/gm/entities/router/modifyAttribute.js";
import modifySkill from "../0-entity/gm/entities/router/modifySkill.js";
import blacklist from "./Gm/blacklist.js";
import removeAbility from '../0-entity/gm/entities/router/removeAbility.js'
import modifyStat from "../0-entity/gm/entities/router/modifyStat.js";
import modifyMaxStat from "../0-entity/gm/entities/router/modifyMaxStat.js";
import addNarrativePerk from "../0-entity/gm/entities/router/addNarrativePerk.js";
import removeNarrativePerk from "../0-entity/gm/entities/router/removeNarrativePerk.js";
import combat from "./Ws/combat.js";
import parts from "./Gm/parts.js";
import addBodypart from "../0-entity/gm/entities/router/addBodypart.js";
import addTrinket from "../0-entity/gm/entities/router/addTrinket.js";
import trinketsList from "../0-entity/gm/items/router/trinketsList.js";
import clothesList from "../0-entity/gm/items/router/clothesList.js";
import energyShildsList from "../0-entity/gm/items/router/energyShildsList.js";
import entityUpgradeList from "../0-entity/gm/items/router/entityUpgradeList.js";
import partUpgradeList from "../0-entity/gm/items/router/partUpgradeList.js";
import wearablesList from "../0-entity/gm/items/router/wearablesList.js";
import soloTrinketInfo from "../0-entity/character/router/soloTrinketInfo.js";
import abilityInfo from "../0-entity/character/router/abilityInfo.js";
import holdablesList from "../0-entity/gm/items/router/holdablesList.js";
import takeHoldable from "../0-entity/gm/entities/router/takeHoldable.js";
import wearableInfo from "../0-entity/character/router/wearableInfo.js";
import createTestCharacter from "../0-entity/gm/createTestCharacter.js";
import untakeHoldable from "../0-entity/gm/entities/router/untakeHoldable.js";
import wearArmor from "../0-entity/gm/entities/router/wearArmor.js";
import changeType from "../0-entity/gm/entities/router/changeType.js";
import addUpgrade from "../0-entity/gm/entities/router/addUpgrade.js";
import removeUpgrade from "../0-entity/gm/entities/router/removeUpgrade.js";
import changeCharacter from "../0-entity/gm/changeCharacter.js";
import defAbilitiesList from "../0-entity/gm/entities/router/defAbilitiesList.js";
import defAbilityInfo from "../0-entity/character/router/defAbilityInfo.js";
import addTag from "../0-entity/gm/entities/router/addTag.js";
import addPartUpgrade from "../0-entity/gm/entities/router/addPartUpgrade.js";
import partInfo from "../0-entity/character/router/partInfo.js";
import clothesInfo from "../0-entity/character/router/clothesInfo.js";
import partUpgradesInfo from "../0-entity/character/router/partUpgradesInfo.js";
import entityUpgragesInfo from "../0-entity/character/router/entityUpgragesInfo.js";
import energyShildInfo from "../0-entity/character/router/energyShildInfo.js";
import holdableInfo from "../0-entity/character/router/holdableInfo.js";
import getSkinsList from "../0-entity/player/getSkinsList.js";

export default async function routes(fastify, options) {
    fastify.route(login)
        .route(registration)
        .route(tokenDiscord)
        .route(loginDiscord)
        .route(loadSkin)
        .route(createCharacter)
        .route(charactersList)
        .route(characterInfo)
        .route(changeRole)
        .route(addAbility)
        .route(abilitiesList)
        .route(modifyAttribute)
        .route(modifySkill)
        .route(blacklist)
        .route(removeAbility)
        .route(modifyStat)
        .route(modifyMaxStat)
        .route(addNarrativePerk)
        .route(removeNarrativePerk)
        .route(parts)
        .route(addBodypart)
        .route(addTrinket)
        .route(trinketsList)
        .route(clothesList)
        .route(energyShildsList)
        .route(entityUpgradeList)
        .route(partUpgradeList)
        .route(wearablesList)
        .route(soloTrinketInfo)
        .route(abilityInfo)
        .route(holdablesList)
        .route(takeHoldable)
        .route(wearableInfo)
        .route(createTestCharacter)
        .route(untakeHoldable)
        .route(wearArmor)
        .route(changeType)
        .route(addUpgrade)
        .route(removeUpgrade)
        .route(changeCharacter)
        .route(defAbilitiesList)
        .route(defAbilityInfo)
        .route(addTag)
        .route(addPartUpgrade)
        .route(partInfo)
        .route(clothesInfo)
        .route(partUpgradesInfo)
        .route(entityUpgragesInfo)
        .route(energyShildInfo)
        .route(holdableInfo)
        .route(getSkinsList)
    fastify.get('/api/combat', {websocket: true}, (connection, req) => {
        combat(connection, req, fastify)
    })
    fastify.get('/api/test', async (request, reply) => {
        for (let i = 0; i < 10; i++) {
            reply.sse({id: String(i), data: "Some message"});
        }
        reply.sse({event: 'end'});
    })
}