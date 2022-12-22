/*import schems from "../../schems/index.js";*/


export default {
    method: 'POST',
    url: '/api/token/discord',
    async handler(req, reply) {
        var registrationSQL = `INSERT INTO ${process.env.CORE_TABLE_NAME} (username, role, access_token, refresh_token) VALUES ( ?, ?, ?, ? )`
        var checkUser = `SELECT username, id FROM ${process.env.CORE_TABLE_NAME} WHERE username = ?`
        var updateInfo = `UPDATE ${process.env.CORE_TABLE_NAME} SET access_token = ?, refresh_token = ? WHERE username = ? `
        var sub_infoReg = `INSERT INTO ${process.env.ADDITIONAL_TABLE_NAME} (id, email, blacklist, discord_id) VALUES ( ?, ?, ?, ? )`

        let info = {}

        if (req.body.discordCode) {
            const querystring = await import('querystring');
            const postData = await querystring.stringify({
                client_id: process.env.DISCORD_ID,
                client_secret: process.env.DISCORD_SECRET,
                code: req.body.discordCode,
                grant_type: 'authorization_code',
                redirect_uri: process.env.WEBSITE_URL,
                scope: 'identify',
            })
            const connection = await this.mariadb.getConnection()
            return await this.axios.post('https://discord.com/api/oauth2/token', postData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
                .then(json => {
                    info = json.data
                    return this.axios.get('https://discord.com/api/users/@me', {
                        headers: {
                            authorization: `Bearer ${json.data.access_token}`
                        }
                    })
                })
                .then((result) => {
                    info = Object.assign(info, result.data)
                    return connection
                        .query(checkUser, [result.data.username + result.data.discriminator])
                })
                .then((result) => {
                    info.insertId = result[0]?.id
                    if(result[0]?.username) return connection
                        .query(updateInfo, [info.access_token, info.refresh_token, info.username + info.discriminator])
                    else return connection
                        .query(registrationSQL, [info.username + info.discriminator, 'user', info.access_token, info.refresh_token])
                        .then((result) => connection
                            .query(sub_infoReg, [parseInt(result.insertId, 10), info.email || null, 0, info.id]))

                })
                .then(() => {
                    connection.release()
                    reply.send({
                        token: this.jwt.sign({
                            username: info.username + info.discriminator,
                            id: info.insertId,
                            access_token: info.access_token,
                            role: 'user',
                        }),
                    })
                })
                .catch((error) => {
                    connection.release()
                    reply.code(500).send({
                        error: error
                    })
                })
        }
    },
    /*schema: schems.login,*/
}