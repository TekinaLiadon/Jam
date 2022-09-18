var pool = require('../../database'),
    jwt = require('jsonwebtoken'),
    decipher = require('../../crypto/decipher'),
    refreshToken = require('../../helpers/refreshToken')
    fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


function loginUser(req, res) {
    const userCheck = `SELECT username, password, id, role FROM ${process.env.CORE_TABLE_NAME} WHERE username=? LIMIT 1`
    const blacklistCheck = `SELECT blacklist FROM ${process.env.ADDITIONAL_TABLE_NAME} WHERE id=? AND blacklist=1 LIMIT 1`
    const accessTokenCheck = `SELECT access_token FROM ${process.env.CORE_TABLE_NAME} WHERE access_token=? AND id=? LIMIT 1`
    let info = ''
    var info2 = {}


    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.TOKEN_KEY, function (err, decoded) {
                if (!decoded) res.status(404).json({message: 'Token not found'})
                else if (decoded.access_token) {
                    Promise.all([
                        pool(blacklistCheck, [decoded.id]),
                        pool(accessTokenCheck, [decoded.access_token, decoded.id]),
                        fetch('https://discord.com/api/users/@me/guilds', {
                            headers: {
                                authorization: `Bearer ${decoded.access_token}`,
                            },
                        })
                    ])
                        .then((result) => {
                            info2.blacklist = result[0][0]
                            info2.statysToken = !result[1][0]
                            return result[2]?.json()
                        })
                        .then((result) => {
                            if (info2.blacklist) res.status(404).json({message: 'User is banned'})
                            else if (info2.statysToken) res.status(404).json({message: 'Access token invalid'})
                            else {
                                const getRefreshToken = `SELECT refresh_token FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
                                const updateTokens = 'UPDATE ${process.env.CORE_TABLE_NAME} SET refresh_token = ?, access_token = ? WHERE id = ?'
                                const isServer = result?.filter((item) => item.id == 875073482373869578)[0]?.id
                                isServer ?
                                    pool(getRefreshToken, [decoded.id])
                                        .then((result) => {
                                            if (result[0].refresh_token) {
                                                return fetch('https://discord.com/api/oauth2/token', {
                                                    method: 'POST',
                                                    body: new URLSearchParams({
                                                        client_id: process.env.DISCORD_ID,
                                                        client_secret: process.env.DISCORD_SECRET,
                                                        grant_type: 'refresh_token',
                                                        refresh_token: result[0].refresh_token,
                                                    }),
                                                    headers: {
                                                        'Content-Type': 'application/x-www-form-urlencoded',
                                                    },
                                                })
                                            } else res.status(404)({message: 'Refresh token invalid'})
                                        })
                                        .then((result) => {
                                            return result.json()
                                        })
                                        .then((result) => {
                                            info = result
                                            return pool(updateTokens, [result.refresh_token, result.access_token, decoded.id])
                                        })
                                        .then(() => {
                                            res.status(200).json({
                                                token: jwt.sign({
                                                    username: info.username,
                                                    id: decoded.id,
                                                    access_token: info.access_token,
                                                }, process.env.TOKEN_KEY),
                                            })
                                        })
                                        .catch(() => {
                                            res.status(500).json({message: 'Err'})
                                        })
                                    : res.status(404).json({message: 'Нет на сервере'})
                            }
                        })
                        .catch(() => {
                            res.status(500)
                        })
                } else {
                    pool(blacklistCheck, [decoded.id])
                        .then((result) => {
                            if (result[0]) res.status(404).json({message: 'User is banned'})
                            else res.status(200)
                                .json({
                                    id: decoded.id,
                                    username: decoded.username,
                                    project: decoded.project,
                                    role: decoded.role,
                                })
                        })
                        .catch(() => {
                            res.status(500)
                        })
                }
            })
    } else {
        pool(userCheck, [req.body.username])
            .then((result) => {
                info = result[0]
                return Promise.all([
                    decipher(req.body.password, result[0].password),
                    pool(blacklistCheck, [result[0].id])
                ])
            })
            .then((result) => {
                if (!result[0] || result[1][0]) throw new Error()
                else res.status(200)
                    .json({
                        id: info.id,
                        username: info.username,
                        role: info.role,
                        token: jwt.sign({
                            id: info.id,
                            username: info.username,
                            role: info.role,
                        }, process.env.TOKEN_KEY)
                    })
            })
            .catch(() => res.status(404).json({message: 'User/password not found'}))
    }
}

module.exports = loginUser