var pool = require('../../database'),
    jwt = require('jsonwebtoken'),
    fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function logout(req, res) {
    const getRefreshToken = `SELECT refresh_token FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`
    const updateTokens = 'UPDATE ${process.env.CORE_TABLE_NAME} SET refresh_token = ?, access_token = ? WHERE id = ?'

    var info = {}

    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(500).json({message: 'Err'})
            else {
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
            }
        }
    )
}

module.exports = logout