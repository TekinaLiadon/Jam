import coreHandler from "../utils/coreHandler.js";


export default {
    method: 'GET',
    url: '/api/holdableInfo',
    handler(req, reply) {
        return coreHandler(req, reply,{
            mariadb: this.mariadb,
            axios: this.axios,
            url: `/items/holdables/${req.query.holdable}?with_snippets=true`,
            type: 'holdable',
            err: 'У вас нет в руках такого предмета'
        })
    },
}