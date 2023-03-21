export default {
    method: 'GET',
    url: '/api/characterInfo',
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
                if(result[1].length === 1) return  reply.send(result[0].data)
                else return reply.code(404).send({message: 'Данный персонаж не найден в списке персонажей'})
            })
            .catch((err) => reply.code(500).send(err))
            .finally(() => connection.release())
    },
}