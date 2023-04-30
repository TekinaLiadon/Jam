import registration from './Auth/registration.js'
import login from './Auth/login.js'
import tokenDiscord from "./Auth/tokenDiscord.js";
import loginDiscord from "./Auth/loginDiscord.js";
import loadSkin from "./Character/loadSkin.js";
import createCharacter from "./Character/createCharacter.js";
import charactersList from "./Character/charactersList.js";
import characterInfo from "./Character/characterInfo.js";
import actualCharacterInfo from "./Sse/actualCharacterInfo.js";
import changeRole from "./Gm/changeRole.js";
import addAbility from "./Gm/addAbility.js";
import abilitiesList from "./Gm/abilitiesList.js";
import modifyAttribute from "./Gm/modifyAttribute.js";
import modifySkill from "./Gm/modifySkill.js";
import blacklist from "./Gm/blacklist.js";
import removeAbility from  './Gm/removeAbility.js'
import modifyStat from "./Gm/modifyStat.js";
import modifyMaxStat from "./Gm/modifyMaxStat.js";
import addNarrativePerk from "./Gm/addNarrativePerk.js";
import removeNarrativePerk from "./Gm/removeNarrativePerk.js";
import combat from "./Ws/combat.js";
import parts from "./Gm/parts.js";
import addBodypart from "./Gm/addBodypart.js";
import addTrinket from "../entities/router/addTrinket.js";
import trinketsList from "../items/router/trinketsList.js";

export default async function routes(fastify, options) {
    fastify.route(login)
    fastify.route(registration)
    fastify.route(tokenDiscord)
    fastify.route(loginDiscord)
    fastify.route(loadSkin)
    fastify.route(createCharacter)
    fastify.route(charactersList)
    fastify.route(characterInfo)
    fastify.route(changeRole)
    fastify.route(addAbility)
    fastify.route(abilitiesList)
    fastify.route(modifyAttribute)
    fastify.route(modifySkill)
    fastify.route(blacklist)
    fastify.route(removeAbility)
    fastify.route(modifyStat)
    fastify.route(modifyMaxStat)
    fastify.route(addNarrativePerk)
    fastify.route(removeNarrativePerk)
    fastify.route(actualCharacterInfo)
    fastify.route(parts)
    fastify.route(addBodypart)
    fastify.route(addTrinket)
    fastify.route(trinketsList)
    fastify.get('/api/combat', { websocket: true }, (connection, req) => {
        combat(connection, req, fastify)
    })
    fastify.get('/api/test', async (request, reply) => {
        for (let i = 0; i < 10; i++) {
            reply.sse({id: String(i), data: "Some message"});
        }
        reply.sse({event: 'end'});
    })
}