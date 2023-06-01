export default {
    method: 'GET',
    url: '/api/characterInfo',
    async handler(req, reply) {
        await this.auth(req, reply)
        const connection = await this.mariadb.getConnection()
        var characterCheck = `SELECT character_name, is_initialized
                              FROM ${process.env.CHARACTER_TABLE_NAME}
                              WHERE id = ?
                                AND character_name = ? LIMIT 1`
        var jsonSave = `UPDATE ${process.env.CHARACTER_TABLE_NAME}
                        SET char_json = ?
                        WHERE id = ?
                          AND character_name = ? LIMIT 1`
        var characterInitialized = `UPDATE ${process.env.CHARACTER_TABLE_NAME} SET is_initialized = 1 WHERE character_name = ?`
        var info;
        return await Promise.all([connection
            .query(characterCheck, [req.user.id, req.query.characterName]),
            this.axios.get(process.env.GAMESYSTEM_URL + `/entities/${req.query.characterName}`)
        ])
            .then((result) => {
                info = result
                return connection
                    .query(jsonSave, [info[1]?.data, req.user.id, req.query.characterName])
            })
            .then(() => {
                if (info[0][0]?.is_initialized === 1) return reply.send(info[1]?.data)
                else if (info[0][0]?.is_initialized === 0 && info[1].data.type !== 'ERROR') return connection
                    .query(characterInitialized, [req.query.characterName])
                    .then(() => reply.send(info[1]?.data))
                else if (info[0][0]?.is_initialized === 0 && info[1].data.type === 'ERROR') return reply.send({message: 'Зайдите в игру, для инициализации'})
                else return reply.code(404).send({message: 'Данный персонаж не найден в списке персонажей'})
            })
            .catch((err) => reply.code(500).send(err))
            .finally(() => connection.release())
    },
}