import coreHandler from "../utils/coreHandler.js";
export default {
    method: 'GET',
    url: '/api/partUpgradesInfo',
    handler(req, reply) {
        return coreHandler(req, reply,{
            mariadb: this.mariadb,
            axios: this.axios,
            url: `/items/part_upgrades/${req.query.partUpgrades}`,
            type: 'partUpgrades',
            err: 'У вас нет такого абгрейда'
        })
    },
}