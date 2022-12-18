

export default {
    async handler(req, reply) {
        await this.auth(req, reply)
        const connection = await this.mariadb.getConnection()
        var characterCheck = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id=? LIMIT 1`
        return await Promise.all([
            this.axios.get(process.env.GAMESYSTEM_URL + `/character/charsheet?player_id=${req.query.characterName}`), // 500 на сервере
            connection
                .query(characterCheck, [req.user.id, req.query.characterName])
        ])
            .then((result) => {
                console.log(result[0].data, result[1].character_name)
                reply.send({s: 's'})
            })
            .catch((err) => {
                reply.code(500).send(err)
            })
    },
    /*schema: schems.login,*/
}