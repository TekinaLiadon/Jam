const pool = require('../../database'),
    jwt = require('jsonwebtoken')

function changeUsername(req, res)  {
    const usernameUpdate = `UPDATE global SET username = ? WHERE id = ?`
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(400).json({message: 'Token not found'})
            else {
                pool(usernameUpdate, [req.body.username, decoded.id]).then(() => {
                    res.status(200).json({
                        token: jwt.sign({
                            id: decoded.id,
                            project: decoded.project,
                            role: decoded.role,
                            username: req.body.username,
                        }, process.env.TOKEN_KEY),
                    })
                }).catch((err) => {
                    res.status(500).json({
                        err: err.text
                    })
                })
            }
        })
}

module.exports = changeUsername