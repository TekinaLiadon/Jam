import coreHandler from "../utils/coreHandler.js";
export default {
    method: 'GET',
    url: '/api/partInfo',
    handler(req, reply) {
        return coreHandler(req, reply,{
            mariadb: this.mariadb,
            axios: this.axios,
            url: `/parts/${req.query.partName}`,
            type: 'part',
            err: 'У вас нет такой части тела'
        })
    },
}