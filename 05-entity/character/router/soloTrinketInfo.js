import coreHandler from "../utils/coreHandler.js";
export default {
    method: 'GET',
    url: '/api/trinketInfo',
    async handler(req, reply) {
        return coreHandler(req, reply,{
            mariadb: this.mariadb,
            axios: this.axios,
            url: `/items/trinkets/${req.query.trinketName}?with_snippets=true`,
            type: 'trinket',
            err: 'У вас нет такого тринкета'
        })
    },
}