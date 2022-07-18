const express = require('express'),
    router = express.Router(),
    createError = require('http-errors'),
    authRoutes = require('./auth/routerList')


router.post('/login', authRoutes.loginUser)

router.post('/registration', authRoutes.registration)

// test route ->

router.get('/info', authRoutes.giveInfo)

router.get('/code', function (req, res, next) {
    next(createError(401))
})

router.post('/changePassword', authRoutes.changePassword)

router.post('/changeUsername', authRoutes.changeUsername)

router.post('/changeRole', authRoutes.changeRole)

router.post('/changeEmail', authRoutes.changeEmail)

router.post('/blacklist', authRoutes.updateBlacklist)

router.post('/blacklistAll', (req, res, next) => {
    next(createError(403))
})

router.post('/addProject', authRoutes.addProject)


router.post('/deleteUser', (req, res, next) => {
    next(createError(403))
})

router.post('/logout', (req, res, next) => {
    next(createError(403))
})

module.exports = router;