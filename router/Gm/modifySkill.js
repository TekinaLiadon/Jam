import roleList from "../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/modifySkill',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
        var connection = await this.mariadb.getConnection()
        return await Promise.all([
            this.axios.post(process.env.GAMESYSTEM_URL + '/entities/mod_skill',
                JSON.stringify({
                    entity: req.body.entityName,
                    modified_object: req.body.skillName,
                    mod: req.body.mod
                }), {
                    headers: {'Content-Type': 'application/json'},
                }
            ),
            connection.query(userRole, [req.user.id])
        ])
            .then((result) => {
                if (roleList[result[1][0].role]?.level >= 5) return reply.send({text: result[0].data.message})
                else return reply.code(403).send({text: 'Недостаточно прав'})
            })
            .catch((err) => reply.code(500).send(err.response.data))
            .finally(() => connection.release())
    }
}