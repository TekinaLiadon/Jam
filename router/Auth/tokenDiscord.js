export default {
    method: 'POST',
    url: '/api/token/discord',
    async handler(req, reply) {
        var registrationSQL = `INSERT INTO ${process.env.CORE_TABLE_NAME} (username, role, access_token, refresh_token) VALUES ( ?, ?, ?, ? )`
        var checkUser = `SELECT username, id FROM ${process.env.CORE_TABLE_NAME} WHERE username = ?`
        var updateInfo = `UPDATE ${process.env.CORE_TABLE_NAME} SET access_token = ?, refresh_token = ? WHERE username = ? `
        var sub_infoReg = `INSERT INTO ${process.env.ADDITIONAL_TABLE_NAME} (id, email, blacklist, discord_id) VALUES ( ?, ?, ?, ? )`

        var info = {}

        const querystring = await import('querystring');
        const postData = await querystring.stringify({
            client_id: process.env.DISCORD_ID,
            client_secret: process.env.DISCORD_SECRET,
            code: req.body.discordCode,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:8080/' || process.env.WEBSITE_URL, // TODO Убрать когда будет релиз
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
                return  Promise.all([
                    this.axios.get('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `Bearer ${json.data.access_token}`
                    }
                }),
                    this.axios.get('https://discord.com/api/users/@me/guilds', {
                        headers: {
                            authorization: `Bearer ${json.data.access_token}`,
                        },
                    })
                ])
            })
            .then((result) => {
                info = Object.assign(info, result[0].data)
                const isServer = result[1].data.filter((item) => item.id == 875073482373869578)[0]?.id
                if (isServer) return connection
                    .query(checkUser, [result[0].data.username + result[0].data.discriminator])
                else throw {code: 'Not on the discord server'}
            })
            .then((result) => {
                info.insertId = result[0]?.id
                if (result[0]?.username) return connection
                    .query(updateInfo, [info.access_token, info.refresh_token, info.username + info.discriminator])
                else return connection
                    .query(registrationSQL, [info.username + info.discriminator, 'user', info.access_token, info.refresh_token])
                    .then((result) => connection
                        .query(sub_infoReg, [parseInt(result.insertId, 10), info.email || null, 0, info.id]))

            })
            .then(() => reply.send({
                token: this.jwt.sign({
                    username: info.username + info.discriminator,
                    id: info.insertId,
                    access_token: info.access_token,
                    role: 'user',
                }),
            }))
            .catch((error) => reply.code(500).send(error))
            .finally(() => connection.release())
    },
    schema: {
        response: {
            default: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
            200: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'success'
                    },
                },
            },
            500: {
                type: 'object',
                properties: {
                    code: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
        },
        body: {
            type: 'object',
            properties: {
                discordCode: {
                    type: 'string',
                },
            },
            required: ['discordCode'],
        }
    },
}