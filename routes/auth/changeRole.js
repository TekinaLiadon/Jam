const pool = require('../../database'),
    jwt = require('jsonwebtoken')

function changeRole (req, res) {
    const userRole = `SELECT role FROM global WHERE id = ? AND role = 'admin'`
    const roleUpdate = `UPDATE global SET role = ? WHERE id = ?`
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(400).json({message: 'Token not found'})
            else {
                pool(userRole, [decoded.id])
                    .then((result) => {
                        if (result[0]) return pool(roleUpdate, [req.body.role, decoded.id]).then(() => {
                            res.status(200).json({
                                username: req.body.username,
                                role: req.body.role,
                            })
                        })
                        else res.status(403).json({message: 'Token not found'})
                    })
                    .catch(() => {
                        res.status(500).json({message: 'Token not found'})
                    })
            }
        })
}

module.exports = changeRole