const pool = require('../../database'),
    jwt = require('jsonwebtoken')

function changeEmail(req, res)  {
    const emailUpdate = `UPDATE ${req.headers.project} SET email = ? WHERE id = ?`
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(404).json({message: 'Token not found'})
            else {
                pool(emailUpdate, [req.body.email, decoded.id]).then(() => {
                    res.status(200).json({
                        username: decoded.username,
                        email: req.body.email,
                    })
                }).catch(() => {
                    res.status(500)
                })
            }
        })
}

module.exports = changeEmail