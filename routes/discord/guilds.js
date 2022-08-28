const pool = require('../../database')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function giveGuilds (req, res) {
    const getToken = 'SELECT access_token FROM global WHERE username = ? LIMIT 1'

    res.status(500).json({
        err: 'No'
    }) // Test route

    pool(getToken, [req.query.username])
        .then((result) => {
            return fetch('https://discord.com/api/users/@me/guilds', {
                headers: {
                    authorization: `Bearer ${result[0].access_token}`,
                },
            })
        })
        .then((result) => {
            return result.json()
        })
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            res.status(500).json({
                err: err.text
            })
        })

}

module.exports = giveGuilds