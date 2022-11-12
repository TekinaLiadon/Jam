var jwt = require('jsonwebtoken'),
    pool = require('../database'),
    fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function jwtCheck(token, noCheck) {
    const blacklistCheck = `SELECT blacklist FROM ${process.env.ADDITIONAL_TABLE_NAME} WHERE id=? AND blacklist=1 LIMIT 1`
    const accessTokenCheck = `SELECT access_token FROM ${process.env.CORE_TABLE_NAME} WHERE access_token=? AND id=? LIMIT 1`

    var tokenInfo = {}

    return new Promise(function (resolve, reject) {
        jwt.verify(
            token,
            process.env.TOKEN_KEY, function (err, decoded) {
                if (!decoded) reject({message: 'Token not found'})
                else if (noCheck) {
                    pool(accessTokenCheck, [decoded.access_token, decoded.id])
                        .then((result) => {
                            if (result[0].id === decoded.id || result[0].access_token === decoded.access_token) resolve(decoded)
                            else reject({message: 'Access token invalid'})
                        })
                }
                else {
                    tokenInfo = decoded
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
                            if (result[0][0]) reject({message: 'User is banned'})
                            else if (result[1][0].id !== decoded.id || result[1][0].access_token !== decoded.access_token)
                                reject({message: 'Access token invalid'})
                            return result[2]?.json()
                        })
                        .then((result) => {
                            const getRefreshToken = `SELECT refresh_token FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
                            const updateTokens = 'UPDATE ${process.env.CORE_TABLE_NAME} SET refresh_token = ?, access_token = ? WHERE id = ?'
                            const isServer = result?.filter((item) => item.id == process.env.ID_DISCORD_SERVER)[0]?.id
                            isServer ?
                                pool(getRefreshToken, [tokenInfo.id])
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
                                        } else reject({message: 'Refresh token invalid'})
                                    })
                                    .then((result) => {
                                        return result.json()
                                    })
                                    .then((result) => {
                                        tokenInfo.access_token = result.access_token
                                        return pool(updateTokens, [result.refresh_token, result.access_token, tokenInfo.id])
                                    })
                                    .then(() => {
                                        resolve(tokenInfo)
                                    })
                                    .catch(() => {
                                        reject({message: 'Err'})
                                    })
                                : reject({message: 'Нет на сервере'})
                        })
                }
            })
    })
}

module.exports = jwtCheck

/*
jwtCheck(req.headers.authorization.split(' ')[1])
    .then((token) => {

            .then((result) => {
                return result.json()
            })
            .then((result) => res.status(200).json(result))
            .catch((err) => res.status(500).json({
                error: err
            }))

    })*/
