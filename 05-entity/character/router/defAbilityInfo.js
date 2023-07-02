import coreHandler from "../utils/coreHandler.js";
export default {
    method: 'GET',
    url: '/api/defAbilityInfo',
    handler(req, reply) {
        return coreHandler(req, reply,{
            mariadb: this.mariadb,
            axios: this.axios,
            url: `/def_abilities/${req.query.abilityName}`,
            type: 'defAbility',
            err: 'У вас нет такой абилки'
        })
    },
}