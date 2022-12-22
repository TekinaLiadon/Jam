

export default {
    async handler(req, reply) {
        await this.auth(req, reply)
        const connection = await this.mariadb.getConnection()
        var characterCheck = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id=? AND character_name=? LIMIT 1`
        return await Promise.all([
            this.axios.get(process.env.GAMESYSTEM_URL + `/entities/${req.query.characterName}`),
            connection
                .query(characterCheck, [req.user.id, req.query.characterName]),
        ])
            .then((result) => {
                console.log(result[0].data)
                if(result[1].length === 1) return  reply.send(result[0].data)
                else return reply.code(500).send({text: 'err'})
            })
            .catch((err) => {
                reply.code(500).send(err)
            })
    },
    /*schema: schems.login,*/
}