import coreHandler from "../utils/coreHandler.js";
export default {
    method: 'GET',
    url: '/api/clothesInfo',
    handler(req, reply) {
        return coreHandler(req, reply,{
            mariadb: this.mariadb,
            axios: this.axios,
            url: `/items/clothes/${req.query.clothesName}?with_snippets=true`,
            type: 'clothes',
            err: 'У вас нет такой одежды'
        })
    },
}