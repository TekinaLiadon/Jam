import schems from "../../schems/index.js";

export default {
    async handler(req, reply) {
        var userCheck = `SELECT username, password, id, role FROM ${process.env.CORE_TABLE_NAME} WHERE username=? LIMIT 1`
        var blacklistCheck = `SELECT blacklist FROM ${process.env.ADDITIONAL_TABLE_NAME} WHERE id=? AND blacklist=1 LIMIT 1`
        var accessTokenCheck = `SELECT access_token FROM ${process.env.CORE_TABLE_NAME} WHERE access_token=? AND id=? LIMIT 1`
        var info = {}
        if(req.body.typeAuth === 'discord') {
            await this.auth(req, reply)
            const connection = await this.mariadb.getConnection()
            return await Promise.all([
                connection
                    .query(blacklistCheck, [req.user.id]),
                connection
                    .query(accessTokenCheck, [req.user?.access_token, req.user.id]),
                this.axios.get('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        authorization: `Bearer ${req.user?.access_token}`,
                    },
                })
            ])
                .then((result) => {
                    console.log(result)
                })
                .catch((err) => {
                    connection.release()
                    reply.code(401).send({
                        text: 'Неверное имя пользователя/пароль',
                        code: err.code
                    })
                });
        }
        else if(req.body.typeAuth === 'defaultToken') {
            await this.auth(req, reply)
            const connection = await this.mariadb.getConnection()
            return await connection.query(blacklistCheck, [req.user.id])
                .then((result) => {
                    if (result[0]) reply.code(401).send({text: 'Пользователь забанен'})
                    else reply.send({
                        token: this.jwt.sign({
                            username: info.username,
                            id: info.id,
                            role: info.role,
                        }),
                    })
                })
                .catch(() => {
                    reply.code(500)
                })
        }
        else if(req.body.typeAuth === 'default') {
            const connection = await this.mariadb.getConnection()
            return await connection
                .query(userCheck, [req.body.username])
                .then((result) => {
                    if(!result[0]) throw new Error()
                    info = result[0]
                    return Promise.all([
                        this.bcrypt.compare(req.body.password, result[0].password),
                        connection
                            .query(blacklistCheck, [result[0].id])
                    ])
                })
                .then((result) => {
                    if (!result[0] || result[1][0]) throw new Error()
                    else {
                        connection.release()
                        reply.send({
                            token: this.jwt.sign({
                                username: info.username,
                                id: info.id,
                                role: info.role,
                            }),
                        })
                    }
                })
                .catch(() => {
                    connection.release()
                    reply.code(401).send({text: 'Неверное имя пользователя/пароль'})
                });
        }
    },
    schema: schems.login,
    /*onRequest: [this.auth]*/
}
