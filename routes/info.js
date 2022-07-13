const pool = require('../database/index')

function giveInfo (req, res) {
    const infoSQL = `SELECT username, role, blacklist  FROM ${req.headers.project} WHERE  username = ?`
    pool(infoSQL, [req.body.username]).then((result) => {
        if (!result[0]) res.status(400)
            .json({
                error: 'User not found'
            })
        else {
            const info = result[0]
            info.blacklist === 0 ? info.blacklist = false : info.blacklist = true
            res.status(200).json({
                username: info.username,
                role: info.role,
                blacklist: info.blacklist
            })
        }
    })
        .catch(() => res.status(500))
}

module.exports = giveInfo