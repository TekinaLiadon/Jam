const pool = require('../../database'),
    jwt = require('jsonwebtoken'),
    decipher = require('../../crypto/decipher'),
    headers = require('../../utils/headers')


function loginUser(req, res) {
    const userCheck = `SELECT username, password, id FROM global WHERE username=? LIMIT 1`
    const loginReg = `SELECT id, blacklist, role FROM ${req.body.project} WHERE id=? LIMIT 1`
    const registrationProject = `INSERT INTO ${req.body.project} (id,blacklist,role) VALUES ( ?, ?, ? )`
    const blacklistCheck = `SELECT blacklist FROM ${req.body.project} WHERE id=? LIMIT 1`
    let info = ''

    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.TOKEN_KEY, function (err, decoded) {
                if (!decoded) res.status(404).json({message: 'Token not found'})
                else {
                        pool(blacklistCheck, [decoded.id])
                        .then((result) => {
                            if (result[0].blacklist === 1) res.status(404).json({message: 'User is banned'})
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
                    pool(loginReg, [result[0].id])
                ])
            })
            .then((result) => {
                info.role = result[1][0]?.role
                if (!result[0] || result[1][0]?.blacklist === 1) throw new Error()
                else if (!result[1][0]?.username) return pool(registrationProject, [info.id, 0, result[1], 'user'])
                else return '+'
            })
            .then(() => {
                res.status(200)
                    .set(headers.cache)
                    .json({
                        id: info.id,
                        username: info.username,
                        project: req.body.project,
                        role: info.role,
                        token: jwt.sign({
                            id: info.id,
                            username: info.username,
                            project: req.body.project,
                            role: info.role,
                        }, process.env.TOKEN_KEY)
                    })
            })
            .catch(() => res.status(404).json({message: 'User/password not found'}))
    }
}

module.exports = loginUser