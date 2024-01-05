import roleList from "../../../../enums/roleList.js";
import roleCheck from "../../../../utils/roleCheck.js";

export default {
    method: 'POST',
    url: '/api/untakeHoldable',
    async handler(req, reply) {
        try {
            var connection = await this.mariadb.getConnection()
            var role = await roleCheck(connection, req.user.id)
            if (roleList[role]?.level < 5) return reply.code(403).send({text: 'Недостаточно прав'})
            var info = await this.axios.post(process.env.GAMESYSTEM_URL + '/entities/untake_holdable',
                JSON.stringify({
                    entity: req.body.entityName,
                    hand: req.body.hand
                }), {
                    headers: {'Content-Type': 'application/json'},
                }
            )
            connection.release()
            return reply.send(info.data)
        } catch (e) {
            return reply.code(500).send(e?.response?.data || e)
        }
    },
}