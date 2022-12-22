import registration from './Auth/registration.js'
import login from './Auth/login.js'
import tokenDiscord from "./Auth/tokenDiscord.js";
import loginDiscord from "./Auth/loginDiscord.js";
import loadSkin from "./Character/loadSkin.js";
import createCharacter from "./Character/createCharacter.js";
import charactersList from "./Character/charactersList.js";
import characterInfo from "./Character/characterInfo.js";
import actualCharacterInfo from "./sse/actualCharacterInfo.js";

export default async function routes(fastify, options) {
    fastify.route(login)
    fastify.route(registration)
    fastify.route(tokenDiscord)
    fastify.route(loginDiscord)
    fastify.route(loadSkin)
    fastify.route(createCharacter)
    fastify.route(charactersList)
    fastify.route(characterInfo)
    fastify.get('/api/actualCharacterInfo', actualCharacterInfo)
    fastify.get('/api/test', async (request, reply) => {
        return {hello: 'world'}
    })
}