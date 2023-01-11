import fastifyPlugin from "fastify-plugin";
import { plugin } from "./plugin.js";

export const FastifySSEPlugin = fastifyPlugin(plugin, {
    name: "fastifySse",
    fastify: ">=3",
});

export default FastifySSEPlugin;