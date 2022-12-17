import registration from './Auth/registration.js'
import login from './Auth/login.js'
import tokenDiscord from "./Auth/tokenDiscord.js";
import loginDiscord from "./Auth/loginDiscord.js";

export default async function routes(fastify, options) {
    fastify.get('/api/test', async (request, reply) => {
        return {hello: 'world'}
    })
    fastify.post('/api/login', login)
    fastify.post('/api/registration', registration)
    fastify.post('/api/token/discord', tokenDiscord)
    fastify.get('/api/login/discord', loginDiscord)
}