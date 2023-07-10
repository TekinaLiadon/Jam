export default {
    method: 'POST',
    url: '/api/token/discord',
    async handler(req, reply) {
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
        try {
            const discordToken = await this.axios.post('https://discord.com/api/oauth2/token', postData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            info = discordToken.data

            const discordGlobalInfo = await Promise.all([
                this.axios.get('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `Bearer ${info.access_token}`
                    }
                }),
                this.axios.get('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        authorization: `Bearer ${info.access_token}`,
                    },
                })
            ])
            info = Object.assign(info, discordGlobalInfo[0].data)

            const isServer = discordGlobalInfo[1].data.filter((item) => item.id == process.env.ID_DISCORD_SERVER)[0]?.id
            if (!isServer) return reply.code(401).send({message: 'Данная сущность не найдена на дискорд сервере'})

            const userStatusCheck = await Promise.all([
                connection
                    .query(`SELECT discord_id, id
                            FROM ${process.env.ADDITIONAL_TABLE_NAME}
                            WHERE discord_id = ? LIMIT 1`, [discordGlobalInfo[0].data.id]),
                JSON.stringify(discordGlobalInfo[1].data),
                connection
                    .query(`SELECT blacklist
                            FROM ${process.env.ADDITIONAL_TABLE_NAME}
                            WHERE discord_id = ?
                              AND blacklist = 1 LIMIT 1`, [discordGlobalInfo[0].data.id]),
            ])
            if (userStatusCheck[2].length > 0) return reply.code(401).send({message: 'Пользователь забанен'})
            info.insertId = userStatusCheck[0][0]?.id
            info.guildJson = userStatusCheck[1]
            await connection.beginTransaction()

            let insertInfo
            info.insertId
                ? await connection
                    .query(`UPDATE ${process.env.CORE_TABLE_NAME}
                            SET access_token = ?,
                                refresh_token = ?
                            WHERE id = ?`,
                        [info.access_token, info.refresh_token, info.insertId])
                : insertInfo = await connection
                    .query(`INSERT INTO ${process.env.CORE_TABLE_NAME} (username, role, access_token, refresh_token, discord_id)
                            VALUES (?, ?, ?, ?, ?)`,
                        [info.username, 'user', info.access_token, info.refresh_token, info.id])

            info.insertId
                ? await connection
                    .query(`UPDATE ${process.env.ADDITIONAL_TABLE_NAME}
                            SET group_json = ?
                            WHERE id = ? `,
                        [info.guildJson, parseInt(info.insertId, 10)])
                : await connection
                    .query(`INSERT INTO ${process.env.ADDITIONAL_TABLE_NAME} (id, email, blacklist, discord_id, group_json)
                            VALUES (?, ?, ?, ?, ?)`,
                        [parseInt(insertInfo.insertId, 10), info.email || null, 0, info.id, info.guildJson])
            if (insertInfo) info.insertId = parseInt(insertInfo.insertId, 10)
            connection.commit()
            connection.end()
            return reply.send({
                token: this.jwt.sign({
                    discordId: info.id,
                    id: info.insertId,
                }),
            })
        } catch (e) {
            return reply.code(520).send(e)
        }
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