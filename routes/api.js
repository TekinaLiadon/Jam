const express = require('express'),
    router = express.Router(),
    createError = require('http-errors'),
    pool = require('../database/index'),
    jwt = require('jsonwebtoken'),
    cipher = require('../crypto/cipher'),
    decipher = require('../crypto/decipher')


router.post('/login', (req, res, next) => {
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
                if (!result[0]) throw new Error()
                else if (result[2][0]?.blacklist === 1) throw new Error()
                else if (!result[2][0]?.username) return pool(registrationProject, [req.body.username, 0, result[1], 'user'])
                else throw new Error()
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

})

router.post('/registration', (req, res, next) => {
    const registrationSQL = `INSERT INTO global (username,PASSWORD,email,blacklist,role,${req.body.project}) VALUES ( ?, ?, ?, ?, ?, ? )`
    const projectReg = `INSERT INTO ${req.body.project} (username,blacklist,hash,role) VALUES ( ?, ?, ?, ? )`
    let hash = ''

    cipher(req.body.password)
        .then((result) => {
            return Promise.all([
                pool(registrationSQL, [req.body.username, result, req.body.email || null, 0, 'user', 1]),
                cipher(req.body.username),
            ])
        })
        .then((result) => {
            hash = result[1]
            return pool(projectReg, [req.body.username, 0, result[1], 'user'])
        })
        .then(() => res.status(200).json({
            username: req.body.username,
            project: req.body.project,
            token: jwt.sign({
                username: req.body.username,
                hash: hash,
                project: req.body.project
            }, process.env.TOKEN_KEY),
        }))
        .catch((err) => err ?
                res.status(400)
                    .json({
                        error: err.text
                    })
                : res.status(500)
        )
})

router.get('/info', function (req, res, next) {
    const infoSQL = `SELECT username, role, blacklist  FROM ${req.headers.project} WHERE  username = ?`
    pool(infoSQL, [req.body.username]).then((result) => {
        if (!result[0]) res.status(400)
            .json({
                error: 'User not found'
            })
        else {
            const info = result[0]
            info.blacklist === 0 ? info.blacklist = false : info.blacklist = true
            res.status(200).json({
                username: info.username,
                role: info.role,
                blacklist: info.blacklist
            })
        }
    })
        .catch(() => res.status(500))
})

router.get('/code', function (req, res, next) {
    next(createError(401))
})

router.post('/changePassword', (req, res, next) => {
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
})

router.post('/changeUsername', (req, res, next) => {
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
})

router.post('/changeRole', (req, res, next) => {
    const userRole = `SELECT role FROM ${req.headers.project} WHERE id = ? AND role = 'admin'`
    const roleUpdate = `UPDATE ${req.headers.project} SET role = ? WHERE username = ?`
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(400).json({message: 'Token not found'})
            else {
                pool(userRole, [decoded.id])
                    .then((result) => {
                        if (result[0]) return pool(roleUpdate, [req.body.role, req.body.username]).then(() => {
                            res.status(200).json({
                                username: req.body.username,
                                role: req.body.role,
                            })
                        })
                        else res.status(403).json({message: 'Token not found'})
                    })
                    .catch((err) => {
                        console.log(err) // логировать
                        res.status(400).json({message: 'Token not found'})
                    })
            }
        })
})

router.post('/changeEmail', (req, res, next) => {
    const emailUpdate = `UPDATE ${req.headers.project} SET email = ? WHERE id = ?`
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(404).json({message: 'Token not found'})
            else {
                pool(emailUpdate, [req.body.email, decoded.id]).then((result) => {
                    console.log(result)
                    res.status(200).json({
                        username: decoded.username,
                        email: req.body.email,
                    })
                }).catch((err) => {
                    console.log(err) // логировать
                })
            }
        })
})

router.post('/blacklist', (req, res, next) => {
    const projectBan = `UPDATE ${req.headers.project} SET blacklist = ? WHERE username = ?`
    const adminCheck = `SELECT role FROM ${req.headers.project} WHERE username = ? AND role = 'admin'`

    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(404).json({message: 'Token not found'})
            else {
                pool(adminCheck, [decoded.username])
                    .then((result) => {
                        if (result[0]?.role) return req.body.command === 'ban' ?
                            pool(projectBan, [1, req.body.username]) :
                            pool(projectBan, [0, req.body.username])
                        else return 'No rights'
                    })
                    .then((result) => {
                        if (result === 'No rights') res.status(200).json({
                            message: 'User is baned'
                        })
                        else res.status(200).json({
                            message: 'Error'
                        })
                    })
                    .catch(() => res.status(500))
            }
        })
})

router.post('/blacklistAll', (req, res, next) => {
    next(createError(403))
})

router.post('/addProject', (req, res, next) => {
    const adminCheck = `SELECT role FROM global WHERE username = ? AND role = 'admin'`
    const addProject = `CREATE TABLE ${req.body.project} (username varchar(20) NOT NULL UNIQUE, role varchar(20), hash varchar(64), blacklist boolean )`
    const addColumn = `ALTER TABLE global ADD COLUMN ${req.body.project} varchar(20)`
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(404).json({message: 'Token not found'})
            else {
                pool(adminCheck, [decoded.username])
                    .then((result) => {
                        return result[0]?.role ?
                            Promise.all([
                                pool(addProject, []),
                                pool(addColumn, [])
                            ]) : 'No rights'
                    })
                    .then((result) => {
                        if (result === 'No rights') res.status(200).json({
                            message: 'Error'
                        })
                        else res.status(200).json({
                            message: 'Add project'
                        })
                    })
                    .catch(() => res.status(500))
            }
        })
})


router.post('/deleteUser', (req, res, next) => {
    next(createError(403))
})

router.post('/logout', (req, res, next) => {
    next(createError(403))
})

module.exports = router;