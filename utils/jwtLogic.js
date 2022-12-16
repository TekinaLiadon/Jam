import fp from 'fastify-plugin'

export default fp(async function(fastify, opts) {
    fastify.register(import("@fastify/jwt"), {
        secret: process.env.TOKEN_KEY
    })

    fastify.decorate("auth", async function(req, reply) {
        try {
            await req.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
})