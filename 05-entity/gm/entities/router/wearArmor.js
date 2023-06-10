import roleList from "../../../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/wearArmor',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return await Promise.all([
            this.axios.post(process.env.GAMESYSTEM_URL + '/entities/wear_armor',
                JSON.stringify({
                    entity: req.body.entityName,
                    wearable: req.body.wearable,
                    upgrades: req.body.upgrades || [],
                    bodypart_key: req.body.bodypartKey,
                    bodypart: req.body.bodypart,
                    curr_durability: req.body.currDurability,
                    time_left: 0,
                }), {
                    headers: {'Content-Type': 'application/json'},
                }
            ),
            connection.query(userRole, [req.user.id])
        ])
            .then((result) => {
                if (roleList[result[1][0].role]?.level >= 5) return reply.send({message: result[0].data.message})
                else return reply.code(403).send({message: 'Недостаточно прав'})
            })
            .catch((err) => reply.code(500).send(err.response.data))
            .finally(() => connection.release())
    },
}