const pool = require('../database/index'),
    jwt = require('jsonwebtoken'),
    cipher = require('../crypto/cipher')

function changePassword (req, res) {
    const passwordUpdate = `UPDATE ${req.headers.project} SET password = ? WHERE id = ?`
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
                            username: decoded.username,
                        })
                    })
                    .catch((err) => {
                        console.log(err) // логировать
                        res.status(500)
                    })
            }
        })
}

module.exports = changePassword