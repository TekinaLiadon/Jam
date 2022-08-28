const pool = require('../../database'),
    jwt = require('jsonwebtoken')

function updateBlacklist(req, res)  {
    const projectBan = `UPDATE sub_info SET blacklist = ? WHERE id = ?`
    const userInfo = 'SELECT id FROM global WHERE username = ? LIMIT 1'
    const adminCheck = `SELECT role FROM global WHERE username = ? AND role = 'admin' LIMIT 1`

    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(404).json({message: 'Token not found'})
            else {
                Promise.all([
                    pool(adminCheck, [decoded.username]),
                    pool(userInfo, [req.body.username])
                ])
                    .then((result) => {
                        console.log(result[1][0].id)
                        if (result[0][0]?.role) return req.body.command === 'ban' ?
                            pool(projectBan, [1, result[1][0].id]) :
                            pool(projectBan, [0, result[1][0].id])
                        else res.status(200).json({
                            message: 'Error'
                        })
                    })
                    .then(() => {
                        res.status(200).json({
                            message: 'User is baned'
                        })
                    })
                    .catch(() => res.status(500))
            }
        })
}

module.exports = updateBlacklist