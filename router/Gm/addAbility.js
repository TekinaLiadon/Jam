

export default {
    method: 'POST',
    url: '/api/addAbility',
    async handler(req, reply) {
        await this.auth(req, reply)
        return await this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_ability',
            JSON.stringify({
                entity: req.body.entityName,
                ability: req.body.abilityName,
            }), {
                headers: {'Content-Type': 'application/json'},
            }
        )
            .then((result) => {
                console.log(result.data)
                reply.send('s')
            })
            .catch((err) => {
                reply.code(500).send(err.response.data)
            })

    }
}