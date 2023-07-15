import roleList from "../../../../enums/roleList.js";

export default {
    method: 'POST',
    url: '/api/changeRole',
    async handler(req, reply) {
        var userRole = `SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? AND role = 'admin' LIMIT 1`
        var selectCharacterName = `SELECT id FROM ${process.env.CHARACTER_TABLE_NAME} WHERE character_name = ? LIMIT 1`
        var roleUpdate = `UPDATE ${process.env.CORE_TABLE_NAME} SET role = ? WHERE id = ?`
        var connection = await this.mariadb.getConnection()
        return await Promise.all([
            connection.query(userRole, [req.user.id]),
            connection.query(selectCharacterName, [req.body.characterName]),
        ])
            .then((result) => {
                if (result[0][0] && result[1][0]?.id && req.body.role === roleList[req.body.role]?.name)
                    return connection.query(roleUpdate, [req.body.role, result[1][0].id])
                else return reply.code(403).send({message: 'Недостаточно прав'})
            })
            .then(() => reply.send({
                    characterName: req.body.characterName,
                    role: req.body.role,
                }))
            .catch(() => reply.code(500).send({message: 'Непредвиденная ошибка'}))
            .finally(() => connection.release())
    }
}