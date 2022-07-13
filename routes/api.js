const express = require('express'),
    router = express.Router(),
    createError = require('http-errors'),
    loginUser = require('../routes/login'),
    registration = require('../routes/registration'),
    giveInfo = require('../routes/info'),
    changePassword = require('../routes/changePassword'),
    changeUsername = require('../routes/changeUsername'),
    changeRole = require('../routes/changeRole'),
    changeEmail = require('../routes/changeEmail'),
    updateBlacklist = require('../routes/blacklist'),
    addProject = require('../routes/addProject')


router.post('/login', loginUser)

router.post('/registration', registration)

// test route ->

router.get('/info', giveInfo)

router.get('/code', function (req, res, next) {
    next(createError(401))
})

router.post('/changePassword', changePassword)

router.post('/changeUsername', changeUsername)

router.post('/changeRole', changeRole)

router.post('/changeEmail', changeEmail)

router.post('/blacklist', updateBlacklist)

router.post('/blacklistAll', (req, res, next) => {
    next(createError(403))
})

router.post('/addProject', addProject)


router.post('/deleteUser', (req, res, next) => {
    next(createError(403))
})

router.post('/logout', (req, res, next) => {
    next(createError(403))
})

module.exports = router;