const pool = require('../../database'),
    jwt = require('jsonwebtoken'),
    decipher = require('../../crypto/decipher')


function loginUser(req, res) {
    const userCheck = `SELECT username, password, id, role FROM global WHERE username=? LIMIT 1`
    const blacklistCheck = `SELECT blacklist FROM sub_info WHERE id=? AND blacklist=1 LIMIT 1`
    const accessTokenCheck = `SELECT access_token FROM global WHERE access_token=? AND id=? LIMIT 1`
    let info = ''


    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.TOKEN_KEY, function (err, decoded) {
                if (!decoded) res.status(404).json({message: 'Token not found'})
                else if (decoded.access_token) {
                    Promise.all([
                        pool(blacklistCheck, [decoded.id]),
                        pool(accessTokenCheck, [decoded.access_token, decoded.id])
                    ])
                        .then((result) => {
                            if (result[0][0]) res.status(404).json({message: 'User is banned'})
                            else if (!result[1][0]) res.status(404).json({message: 'Access token invalid'})
                            else {
                                res.status(200)
                                    .json({
                                        username: decoded.username,
                            })
                            }
                        })
                        .catch(() => {
                            res.status(500)
                        })
                } else {
                    pool(blacklistCheck, [decoded.id])
                        .then((result) => {
                            if (result[0]) res.status(404).json({message: 'User is banned'})
                            else res.status(200)
                                .json({
                                    id: decoded.id,
                                    username: decoded.username,
                                    project: decoded.project,
                                    role: decoded.role,
                                })
                        })
                        .catch(() => {
                            res.status(500)
                        })
                }
            })
    } else {
        pool(userCheck, [req.body.username])
            .then((result) => {
                info = result[0]
                return Promise.all([
                    decipher(req.body.password, result[0].password),
                    pool(blacklistCheck, [result[0].id])
                ])
            })
            .then((result) => {
                if (!result[0] || result[1][0]) throw new Error()
                else res.status(200)
                    .json({
                        id: info.id,
                        username: info.username,
                        role: info.role,
                        token: jwt.sign({
                            id: info.id,
                            username: info.username,
                            role: info.role,
                        }, process.env.TOKEN_KEY)
                    })
            })
            .catch(() => res.status(404).json({message: 'User/password not found'}))
    }
}

module.exports = loginUser