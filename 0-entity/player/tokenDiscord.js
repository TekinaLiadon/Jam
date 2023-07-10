export default {
    method: 'POST',
    url: '/api/token/discord',
    async handler(req, reply) {
        var checkUser = `SELECT discord_id, id FROM ${process.env.ADDITIONAL_TABLE_NAME} WHERE discord_id = ? LIMIT 1`
        var sub_infoReg = `INSERT INTO ${process.env.ADDITIONAL_TABLE_NAME} (id, email, blacklist, discord_id, group_json) VALUES ( ?, ?, ?, ?, ? )`
        var updateGuilds = `UPDATE ${process.env.ADDITIONAL_TABLE_NAME} SET group_json = ? WHERE id = ? `
        var blacklistCheck = `SELECT blacklist FROM ${process.env.ADDITIONAL_TABLE_NAME} WHERE discord_id = ? AND blacklist=1 LIMIT 1`

        var info = {}
        var redirectUri = 'http://localhost:8080/'

        const querystring = await import('querystring');
        const postData = await querystring.stringify({
            client_id: process.env.DISCORD_ID,
            client_secret: process.env.DISCORD_SECRET,
            code: req.body.discordCode,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri || process.env.WEBSITE_URL, // TODO Убрать когда будет релиз
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
                return Promise.all([
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
                const isServer = result[1].data.filter((item) => item.id == process.env.ID_DISCORD_SERVER)[0]?.id
                if (isServer) return Promise.all([
                    connection
                        .query(checkUser, [result[0].data.id]),
                    JSON.stringify(result[1].data),
                    connection
                        .query(blacklistCheck, [result[0].data.id]),
                ])
                else reply.code(401).send({message: 'Данная сущность не найдена на дискорд сервере'})
            })
            .then((result) => {
                if (result[2].length > 0) reply.code(401).send({message: 'Пользователь забанен'})
                info.insertId = result[0][0]?.id
                info.guildJson = result[1]
                return connection.beginTransaction()
            })
            .then(() => {
                return info.insertId ?
                    connection
                        .query(`UPDATE ${process.env.CORE_TABLE_NAME} SET access_token = ?, refresh_token = ? WHERE id = ?`,
                            [info.access_token, info.refresh_token, info.insertId])
                    : connection
                        .query(`INSERT INTO ${process.env.CORE_TABLE_NAME} (username, role, access_token, refresh_token, discord_id) VALUES ( ?, ?, ?, ?, ? )`,
                            [info.username, 'user', info.access_token, info.refresh_token, info.id])
            })
            .then((result) => {
                return info.insertId ?
                    connection
                        .query(updateGuilds, [info.guildJson, parseInt(info.insertId, 10)])
                    : connection
                        .query(sub_infoReg, [parseInt(result.insertId, 10), info.email || null, 0, info.id, info.guildJson])
                        .then(()=> info.insertId = parseInt(result.insertId, 10))
            })
            .then(() => {
                connection.commit()
                reply.send({
                    token: this.jwt.sign({
                        discordId: info.id,
                        id: info.insertId,
                    }),
                })
            })
            .catch((error) => {
                reply.code(500).send(error)
            })
            .finally(() => connection.end())
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
            401: {
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