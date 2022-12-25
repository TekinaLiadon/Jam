


export default {
    method: 'GET',
    url: '/api/charactersList',
    async handler(req, reply) {
        await this.auth(req, reply)
        const connection = await this.mariadb.getConnection()
        var characterCheck = `SELECT character_name, skin, uuid FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id = ?`
        return Promise.all([
            this.axios.get(process.env.GAMESYSTEM_URL + '/characters?name_only=true'),
            connection
                .query(characterCheck, req.user.id)
        ])
            .then((result) => {
                const characterList = result[0].data.filter((el) => result[1].some((item) => item.uuid === el.uuid))
                if (!characterList[0]?.uuid) reply.code(404).send({message: 'Персонажей не существует'})
                else {
                    const info = characterList.map((item) => {
                        return {
                            name: item.name,
                            display_name: item.display_name,
                            skin: `https://tardigrade.ariadna.su/skins/${result[1].find((el) => el.uuid === item.uuid).skin}`
                        }
                    })
                    reply.send(info)
                }
            })
            .catch((err) => reply.code(500).send(err))
    },
    /*schema: schems.loginDiscord,*/
}