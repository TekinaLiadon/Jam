import registration from './Auth/registration.js'
import login from './Auth/login.js'
import tokenDiscord from "./Auth/tokenDiscord.js";
import loginDiscord from "./Auth/loginDiscord.js";
import loadSkin from "./Character/loadSkin.js";
import createCharacter from "./Character/createCharacter.js";
import charactersList from "./Character/charactersList.js";
import characterInfo from "./Character/characterInfo.js";
import changeRole from "./Gm/changeRole.js";
import addAbility from "../05-entity/gm/entities/router/addAbility.js";
import abilitiesList from "../05-entity/gm/entities/router/abilitiesList.js";
import modifyAttribute from "../05-entity/gm/entities/router/modifyAttribute.js";
import modifySkill from "../05-entity/gm/entities/router/modifySkill.js";
import blacklist from "./Gm/blacklist.js";
import removeAbility from '../05-entity/gm/entities/router/removeAbility.js'
import modifyStat from "../05-entity/gm/entities/router/modifyStat.js";
import modifyMaxStat from "../05-entity/gm/entities/router/modifyMaxStat.js";
import addNarrativePerk from "../05-entity/gm/entities/router/addNarrativePerk.js";
import removeNarrativePerk from "../05-entity/gm/entities/router/removeNarrativePerk.js";
import combat from "./Ws/combat.js";
import parts from "./Gm/parts.js";
import addBodypart from "../05-entity/gm/entities/router/addBodypart.js";
import addTrinket from "../05-entity/gm/entities/router/addTrinket.js";
import trinketsList from "../05-entity/gm/items/router/trinketsList.js";
import clothesList from "../05-entity/gm/items/router/clothesList.js";
import energyShildsList from "../05-entity/gm/items/router/energyShildsList.js";
import entityUpgradeList from "../05-entity/gm/items/router/entityUpgradeList.js";
import partUpgradeList from "../05-entity/gm/items/router/partUpgradeList.js";
import wearablesList from "../05-entity/gm/items/router/wearablesList.js";
import soloTrinketInfo from "../05-entity/character/router/soloTrinketInfo.js";
import abilityInfo from "../05-entity/character/router/abilityInfo.js";
import holdablesList from "../05-entity/gm/items/router/holdablesList.js";
import takeHoldable from "../05-entity/gm/entities/router/takeHoldable.js";
import wearableInfo from "../05-entity/character/router/wearableInfo.js";
import createTestCharacter from "../05-entity/gm/createTestCharacter.js";
import untakeHoldable from "../05-entity/gm/entities/router/untakeHoldable.js";
import wearArmor from "../05-entity/gm/entities/router/wearArmor.js";
import changeType from "../05-entity/gm/entities/router/changeType.js";
import addUpgrade from "../05-entity/gm/entities/router/addUpgrade.js";
import removeUpgrade from "../05-entity/gm/entities/router/removeUpgrade.js";
import changeCharacter from "../05-entity/gm/changeCharacter.js";
import defAbilitiesList from "../05-entity/gm/entities/router/defAbilitiesList.js";

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