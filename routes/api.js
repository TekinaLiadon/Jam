const express = require('express'),
    router = express.Router(),
    createError = require('http-errors'),
    authRoutes = require('./auth/routerList'),
    characterRoutes = require('./character/characterList'),
    discordAPIRoutes = require('./discord/discordList'),
    battleInfo = require('./sse/battleInfo')

router.get('/login/discord', authRoutes.loginDiscord)
router.post('/token/discord', authRoutes.tokenDiscord)
router.post('/login', authRoutes.loginUser)
router.post('/registration', authRoutes.registration)
router.get('/info', authRoutes.giveInfo)
router.get('/code', function (req, res, next) {
    next(createError(401))
})
router.post('/changePassword', authRoutes.changePassword)
router.post('/changeUsername', authRoutes.changeUsername)
router.post('/changeRole', authRoutes.changeRole)
router.post('/changeEmail', authRoutes.changeEmail)
router.post('/blacklist', authRoutes.updateBlacklist)
router.post('/deleteUser', (req, res, next) => {
    next(createError(403))
})
router.get('/logout', authRoutes.logout)

router.post('/createCharacter', characterRoutes.createCharacter)

router.get('/guildsUser', discordAPIRoutes.guilds)
router.get('/refreshToken', discordAPIRoutes.refreshToken)


router.get('/events', battleInfo )

module.exports = router;