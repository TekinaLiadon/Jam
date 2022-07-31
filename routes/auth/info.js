const pool = require('../../database')

function giveInfo (req, res) {
    const infoSQL = `SELECT username, role, blacklist FROM global, sub_info WHERE global.id = ?`
    pool(infoSQL, [req.body.id]).then((result) => {
        if (!result[0]) res.status(400)
            .json({
                error: 'User not found'
            })
        else {
            res.status(200).json({
                username: result[0].username,
                role: result[0].role,
                blacklist: result[0].blacklist,
            })
        }
    })
        .catch((err) => {
            res.status(500).json({
                err: err.text
            })
        })
}

module.exports = giveInfo