const pool = require('../database/index'),
    jwt = require('jsonwebtoken')

function changeUsername(req, res)  {
    const usernameUpdate = `UPDATE ${req.headers.project} SET username = ? WHERE id = ?`
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(400).json({message: 'Token not found'})
            else {
                pool(usernameUpdate, [req.body.username, decoded.id]).then(() => {
                    res.status(200).json({
                        username: req.body.username,
                        token: jwt.sign({
                            id: decoded.id,
                            username: req.body.username,
                            hash: decoded.hash
                        }, process.env.TOKEN_KEY),
                    })
                }).catch((err) => {
                    console.log(err) // логировать
                    res.status(500)
                })
            }
        })
}

module.exports = changeUsername