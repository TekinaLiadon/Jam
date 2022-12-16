import registration from './Auth/registration.js'
import login from './Auth/login.js'

export default async function routes(fastify, options) {
    fastify.get('/api/test', async (request, reply) => {
        return {hello: 'world'}
    })
    fastify.post('/api/login', login)
    fastify.post('/api/registration', registration)
}