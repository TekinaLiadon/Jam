import roleList from "../../../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/addBodypart',
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return await connection.query(userRole, [req.user.id])
            .then((result) => {
                if (roleList[result[0].role]?.level >= 5) return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/add_bodypart',
                    JSON.stringify({
                        entity: req.body.entityName,
                        bodypart: req.body.bodypart,
                        key_name: req.body.key,
                        curr_hp: req.body.currHp,
                        time_to_live: 0,
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
                else return reply.code(403).send({message: 'Недостаточно прав'})
            })
            .then((result) => {
                return reply.send(result.data)
            })
            .catch((err) => reply.code(500).send(err))
            .finally(() => connection.release())
    },
}