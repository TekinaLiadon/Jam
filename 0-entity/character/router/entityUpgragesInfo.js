import coreHandler from "../utils/coreHandler.js";
export default {
    method: 'GET',
    url: '/api/entityUpgradesInfo',
    handler(req, reply) {
        return coreHandler(req, reply,{
            mariadb: this.mariadb,
            axios: this.axios,
            url: `/items/entity_upgrades/${req.query.entityUpgrades}`,
            type: 'entityUpgrades',
            err: 'У вас нет такого апгрейда'
        })
    },
}