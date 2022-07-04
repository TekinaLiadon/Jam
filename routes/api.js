const express = require('express'),
    router = express.Router(),
    createError = require('http-errors'),
    pool = require('../database/index'),
    jwt = require('jsonwebtoken'),
    cipher = require('../crypto/cipher'),
    decipher = require('../crypto/decipher')


router.post('/login', (req, res, next) => {
    const userCheck = `SELECT username, password, id FROM global WHERE username=? LIMIT 1`
    const loginReg = `SELECT username, FROM ${req.headers.project} WHERE username=? LIMIT 1`
    const hashCheck = `SELECT hash FROM global WHERE id=?`
    let info = ''


    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.TOKEN_KEY, function (err, decoded) {
                if (!decoded) res.status(404).json({message: 'Token not found'})
                else {
                    pool(hashCheck, [decoded.id])
                        .then((result) => {
                            if (result[0].hash !== null) res.status(200).json({
                                username: decoded.username,
                            })
                            else res.status(404).json({message: 'Token invalided'}) // капча
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
                return decipher(req.body.password, result[0].password)
            })
            .then((result) => {
                return result ? cipher(info.username) : false
            })
            .then((result) => {
                if (result) res.status(200).json({
                    id: info.id,
                    username: info.username,
                    token: jwt.sign({id: info.id, username: info.username, hash: result,}, process.env.TOKEN_KEY),
                })
                else res.status(404).json({message: 'Password error'})
            })
            .catch(() => res.status(404).json({message: 'User not found'}))
    }

})

router.post('/registration', (req, res, next) => {
    const registrationSQL = `INSERT INTO global (username,PASSWORD,email,hash,blacklist,role) VALUES ( ?, ?, ?, ?, ?, ? )`
    const projectReg = `INSERT INTO ${req.headers.project} (username,blacklist,role) VALUES ( ?, ?, ? )`
    const hashUpdate = `UPDATE global SET hash = ? WHERE id = ?`
    let hash = ''
    let id = 0

    cipher(req.body.password)
        .then((result) => {
            return pool(registrationSQL, [req.body.username, result, req.body.email || null, null, 0, 'user'])
        })
        .then((result) => {
            id = parseInt(result.insertId, 10)
            return cipher(req.body.username)
        })
        .then((result) => {
            hash = result
            return pool(hashUpdate, [result, id])
        })
        .then(() => {
            return pool(projectReg, [req.body.username, 0, 'user'])
        })
        .then(() => res.status(200).json({
            username: req.body.username,
            token: jwt.sign({id: id, username: req.body.username, hash: hash}, process.env.TOKEN_KEY),
        }))
        .catch((err) => err ?
            res.status(400)
                .json({
                    error: err.text
                })
            : res.status(500))
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
    next(createError(401))
})

router.post('/blacklistAll', (req, res, next) => {
    next(createError(403))
})

router.post('/addProject', (req, res, next) => {
    next(createError(403))
})


router.post('/deleteUser', (req, res, next) => {
    next(createError(403))
})

router.post('/logout', (req, res, next) => {
    next(createError(403))
})

module.exports = router;