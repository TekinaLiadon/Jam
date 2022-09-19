const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const pool = require('../../database'),
    jwt = require('jsonwebtoken')

async function getTokenUser(req, res) {
    const registrationSQL = `INSERT INTO ${process.env.CORE_TABLE_NAME} (username, role, access_token, refresh_token) VALUES ( ?, ?, ?, ? )`
    const checkUser = `SELECT username FROM ${process.env.CORE_TABLE_NAME} WHERE username = ?`
    const updateInfo = `UPDATE ${process.env.CORE_TABLE_NAME} SET access_token = ? refresh_token = ? WHERE username = ? `
    const sub_infoReg = `INSERT INTO ${process.env.ADDITIONAL_TABLE_NAME} (id, email, blacklist, discord_id) VALUES ( ?, ?, ?, ? )`

    let id = 0
    let info = {}

    if (req.body.discordCode) {
        const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.DISCORD_ID,
                client_secret: process.env.DISCORD_SECRET,
                code: req.body.discordCode,
                grant_type: 'authorization_code',
                redirect_uri: process.env.WEBSITE_URL,
                scope: 'identify',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(res => {
                return res.json()
            })
            .then(json => {
                info = json
                return fetch('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `Bearer ${json.access_token}`
                    }
                })
            })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                info = Object.assign(info, result)
                return pool(checkUser, [result.username + result.discriminator])
            })
            .then((result) => {
                if(result[0].username) return pool(updateInfo, [info.access_token, info.refresh_token])
                else return pool(registrationSQL, [result.username + result.discriminator, 'user', info.access_token, info.refresh_token])

            })
            .then((result) => {
                id = parseInt(result.insertId, 10)
                return pool(sub_infoReg, [id, info.email || null, 0, info.id])
            })
            .then(() => {
                res.status(200).json({
                    username: info.username,
                    project: req.body.project,
                    id: id,
                    role: 'user',
                    token: jwt.sign({
                        username: info.username,
                        id: id,
                        access_token: info.access_token,
                    }, process.env.TOKEN_KEY),
                })
            })
            .catch((error) => res.status(500).json({
                error: error
            }))
    }
}

module.exports = getTokenUser