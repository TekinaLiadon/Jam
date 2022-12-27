import registration from './Auth/registration.js'
import login from './Auth/login.js'
import tokenDiscord from "./Auth/tokenDiscord.js";
import loginDiscord from "./Auth/loginDiscord.js";
import loadSkin from "./Character/loadSkin.js";
import createCharacter from "./Character/createCharacter.js";
import charactersList from "./Character/charactersList.js";
import characterInfo from "./Character/characterInfo.js";
import actualCharacterInfo from "./sse/actualCharacterInfo.js";
import changeRole from "./Gm/changeRole.js";
import addAbility from "./Gm/addAbility.js";
import abilitiesList from "./Gm/abilitiesList.js";
import modifyAttribute from "./Gm/modifyAttribute.js";
import modifySkill from "./Gm/modifySkill.js";
import blacklist from "./Gm/blacklist.js";

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
    fastify.get('/api/actualCharacterInfo', actualCharacterInfo)
    fastify.get('/api/test', async (request, reply) => {
        return {hello: 'world'}
    })
}