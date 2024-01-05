import coreHandler from "../utils/coreHandler.js";

export default {
    method: 'GET',
    url: '/api/wearableInfo',
    handler(req, reply) {
        return coreHandler(req, reply,{
            mariadb: this.mariadb,
            axios: this.axios,
            url: `/items/wearables/${req.query.wearableName}?with_snippets=true`,
            type: 'wearable',
            err: 'У вас нет такого элемента брони',
        })
    },
}