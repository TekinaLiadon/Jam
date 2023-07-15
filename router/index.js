import routerList from "./routerList.js";
import combat from "./Ws/combat.js";
import createTestCharacter from "../0-entity/gm/createTestCharacter.js";
import changeCharacter from "../0-entity/gm/changeCharacter.js";

export default async function routes(fastify, options) {
    const list = await routerList()
    Object.keys(list).map((el) => {
        fastify.route(list[el].default)
    })
    fastify.route(changeCharacter)
        .route(createTestCharacter)
        /*.route(combat)*/
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