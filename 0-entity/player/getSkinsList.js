export default {
    method: 'GET',
    url: '/api/skinsList',
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const skinsCheck = `SELECT skin FROM ${process.env.SKINS_TABLE_NAME} WHERE id = ?`
        const skinsList = await connection.query(skinsCheck, [req.user.id])
        if (skinsList.length > 0) return reply.code(403).send(skinsList.map((el) => {
            const result = `https://tardigrade.ariadna.su/skins/${el.skin}`
            return result
        }))
        else return reply.code(403).send({text: "У вас нет загруженных скинов"})
    },
}