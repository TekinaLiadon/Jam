import roleList from "../../../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/takeHoldable',
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return await Promise.all([
            this.axios.post(process.env.GAMESYSTEM_URL + '/entities/take_holdable',
                JSON.stringify({
                    entity: req.body.entityName,
                    holdable: req.body.holdable,
                    upgrades: req.body.upgrades || [],
                    hand: req.body.hand
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