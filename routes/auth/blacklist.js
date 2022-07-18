const pool = require('../../database'),
    jwt = require('jsonwebtoken')

function updateBlacklist(req, res)  {
    const projectBan = `UPDATE ${req.headers.project} SET blacklist = ? WHERE username = ?`
    const adminCheck = `SELECT role FROM ${req.headers.project} WHERE username = ? AND role = 'admin'`

    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(404).json({message: 'Token not found'})
            else {
                pool(adminCheck, [decoded.username])
                    .then((result) => {
                        if (result[0]?.role) return req.body.command === 'ban' ?
                            pool(projectBan, [1, req.body.username]) :
                            pool(projectBan, [0, req.body.username])
                        else return 'No rights'
                    })
                    .then((result) => {
                        if (result === 'No rights') res.status(200).json({
                            message: 'User is baned'
                        })
                        else res.status(200).json({
                            message: 'Error'
                        })
                    })
                    .catch(() => res.status(500))
            }
        })
}

module.exports = updateBlacklist