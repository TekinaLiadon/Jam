import schems from "../../schems/index.js";

export default {
    method: 'POST',
    url: '/api/registration',
    async handler(req, reply) {
        let id = 0
        const connection = await this.mariadb.getConnection()
        return await this.bcrypt.hash(req.body.password)
            .then((hash) => {
                return connection.query(`INSERT INTO ${process.env.CORE_TABLE_NAME} (username,PASSWORD,role) VALUES ( ?, ?, ? )`, [req.body.username, hash, 'user', 1])
            })
            .then((result) => {
                id = parseInt(result.insertId, 10)
                return connection.query(`INSERT INTO ${process.env.ADDITIONAL_TABLE_NAME} (id, email ,blacklist) VALUES ( ?, ?, ? )`, [parseInt(result.insertId, 10), req.body.email || null, 0,])
            })
            .then(() => {
                connection.release()
                reply.send({
                    token: this.jwt.sign({
                        username: req.body.username,
                        id: id,
                        role: 'user'
                    }),
                })
            })
            .catch(err => {
                connection.release()
                err?.type === "SqlError" ? reply.code(500).send(err) : reply.send(err) // code "ER_DUP_ENTRY" экранировать
            })
    },
    schema: schems.registration,
}