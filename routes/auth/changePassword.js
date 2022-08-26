const pool = require('../../database'),
    jwt = require('jsonwebtoken'),
    cipher = require('../../crypto/cipher')

function changePassword (req, res) {
    const passwordUpdate = `UPDATE global SET password = ? WHERE id = ?`
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(400).json({message: 'Token not found'})
            else {
                cipher(req.body.password)
                    .then((result) => {
                        return pool(passwordUpdate, [result, decoded.id])
                    })
                    .then(() => {
                        res.status(200).json({
                            id: decoded.id,
                            username: decoded.username,
                        })
                    })
                    .catch((err) => {
                        res.status(500).json({
                            err: err.text
                        })
                    })
            }
        })
}

module.exports = changePassword