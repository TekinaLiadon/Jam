let express = require('express');
let router = express.Router();
const createError = require('http-errors');
const pool = require('../database/index')

// 'SELECT username FROM accounts WHERE user_id = 2'
// const text = 'SELECT username, password FROM accounts WHERE username = $1 AND password = $2'
// const value = [req.body.username, req.body.password]
/* const text = 'SELECT username, password FROM accounts WHERE username = $1 AND password = $2'
    const value = [req.body.username, req.body.password]
        pool.query(text, value, (err, data) => {
            if(err){
                console.log(err.stack)
            } else {
                if (data.rows.length === 0) {
                    next(createError(401, 'Неверное имя пользователя или пароль'))
                } else  {
                    res.json(data.rows[0].username)
                }
            }
        })

 */

router.post('/login', (req, res, next) => {
    next(createError(401))
})

router.post('/registration', (req, res, next) => {
    const registrationInfo = [req.body.username, req.body.password, req.body.email || null, 0, 'user']
    const registrationSQL = "INSERT INTO test (username,PASSWORD,email,blacklist,role) VALUES (?, ?, ?, ?, ? )"
    const checkSQL = "SELECT true FROM `test` WHERE username = ? LIMIT 1"
    const status = {"status": "ok"}

    pool(checkSQL, [req.body.username])
        .then(result => {
            if (!result[0]) {
                pool(registrationSQL, registrationInfo)
                    .then(() => res.json(status))
                    .catch(err => {
                        console.error(err)
                        next()
                    })
            } else {
                next(createError(401))
            }
        })
        .catch(err => {
            console.error(err)
            next()
        })
})

router.get('/info', function(req, res, next) {
    next(createError(401))
})

router.post('/code', function(req, res, next) {
    next(createError(401))
})

router.post('/changePassword', (req, res, next) => {
    next(createError(401))
})

router.post('/changeLogin', (req, res, next) => {
    next(createError(401))
})

router.post('/changeRole', (req, res, next) => {
    next(createError(401))
})

router.post('/changeEmail', (req, res, next) => {
    next(createError(401))
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

const a = 'CREATE TABLE stargazer(username varchar(20), password varchar(20), email varchar(20), role varchar(20), blacklist boolean)'

router.post('/deleteUser', (req, res, next) => {
    next(createError(403))
})

module.exports = router;