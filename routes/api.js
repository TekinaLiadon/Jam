let express = require('express');
let router = express.Router();
const pool = require('../database/index')
const createError = require('http-errors');

router.get('/a', function(req, res, next) {
    pool.query('SELECT username FROM accounts WHERE user_id = 2', (err, data) =>{
        if(err){
            console.log(err.stack)
        } else {
            res.send(data.rows)
        }
    })
});
router.post('/registration', (req, res, next) => {
    const text = 'SELECT username, password FROM accounts WHERE username = $1 AND password = $2'
    const value = [req.body.username, req.body.password]
    next(createError(401))
})

router.post('/auth', (req, res, next) => {
    const text = 'SELECT username, password FROM accounts WHERE username = $1 AND password = $2'
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

})

module.exports = router;