const pool = require('../database/index'),
    jwt = require('jsonwebtoken'),
    cipher = require('../crypto/cipher'),
    decipher = require('../crypto/decipher')


function loginUser(req, res) {
    const userCheck = `SELECT username, password, id, ${req.body.project} FROM global WHERE username=? LIMIT 1`
    const loginReg = `SELECT username, blacklist FROM ${req.body.project} WHERE username=? LIMIT 1`
    const registrationProject = `INSERT INTO ${req.body.project} (username,blacklist,hash,role) VALUES ( ?, ?, ?, ? )`
    const hashCheck = `SELECT hash FROM global WHERE id=? LIMIT 1`
    const blacklistCheck = `SELECT blacklist FROM ${req.body.project} WHERE username=? LIMIT 1`
    let info = ''

    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.TOKEN_KEY, function (err, decoded) {
                if (!decoded) res.status(404).json({message: 'Token not found'})
                else {
                    Promise.all([
                        pool(hashCheck, [decoded.id]),
                        pool(blacklistCheck, [decoded.username])
                    ])
                        .then((result) => {
                            if (result[1].blacklist === 1) res.status(404).json({message: 'User is banned'})
                            else if (result[0].hash !== null) res.status(200).json({
                                username: decoded.username,
                            })
                            else res.status(404).json({message: 'Token invalided'})
                        })
                        .catch((err) => {
                            console.log(err) // логировать
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
                    cipher(result[0].username),
                    pool(loginReg, [result[0].username])
                ])
            })
            .then((result) => {
                info.hash = result[1]
                if (!result[0] || result[2][0]?.blacklist === 1) throw new Error()
                else if (!result[2][0]?.username) return pool(registrationProject, [req.body.username, 0, result[1], 'user'])
                else return '+'
            })
            .then(() =>{
                res.status(200).json({
                    id: info.id,
                    username: info.username,
                    project: req.body.project,
                    token: jwt.sign({
                        id: info.id,
                        username: info.username,
                        hash: info.hash,
                    }, process.env.TOKEN_KEY)
                })
            })
            .catch(() => res.status(404).json({message: 'User not found'}))
    }
}

module.exports = loginUser