import coreHandler from '../utils/coreHandler.js'
export default {
    method: 'GET',
    url: '/api/energyShieldsInfo',
    handler(req, reply){
        return coreHandler(req, reply,{
            mariadb: this.mariadb,
            axios: this.axios,
            url: `/items/energy_shields/${req.query.energyShields}?with_snippets=true`,
            type: 'energyShields',
            err: 'У вас нет такого щита'
        })
    },
}