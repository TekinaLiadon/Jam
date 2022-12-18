import registration from './Auth/registration.js'
import login from './Auth/login.js'
import tokenDiscord from "./Auth/tokenDiscord.js";
import loginDiscord from "./Auth/loginDiscord.js";
import loadSkin from "./Character/loadSkin.js";
import createCharacter from "./Character/createCharacter.js";
import charactersList from "./Character/charactersList.js";
import characterInfo from "./Character/characterInfo.js";

export default async function routes(fastify, options) {
    fastify.get('/api/test', async (request, reply) => {
        return {hello: 'world'}
    })
    fastify.post('/api/login', login)
    fastify.post('/api/registration', registration)
    fastify.post('/api/token/discord', tokenDiscord)
    fastify.get('/api/login/discord', loginDiscord)
    fastify.post('/api/loadSkin', loadSkin)
    fastify.post('/api/createCharacter', createCharacter)
    fastify.get('/api/charactersList', charactersList)
    fastify.get('/api/characterInfo', characterInfo)
}