const express = require('express'),
    router = express.Router(),
    createError = require('http-errors'),
    authRoutes = require('./auth/routerList'),
    characterRoutes = require('./character/characterList'),
    discordAPIRoutes = require('./discord/discordList'),
    systemList = require('./gamesystem/systemList'),
    battleInfo = require('./sse/battleInfo')

router.get('/login/discord', authRoutes.loginDiscord)
router.post('/token/discord', authRoutes.tokenDiscord)
router.post('/login', authRoutes.loginUser)
router.post('/registration', authRoutes.registration)
router.get('/info', authRoutes.giveInfo)
router.get('/abilities', systemList.abilities)
router.get('/abilitiesList', systemList.abilitiesList)
router.get('/defAbilitiesList', systemList.defAbilitiesList)
router.get('/defAbilities', systemList.defAbilities)
router.get('/characters', systemList.characters)
router.get('/charactersList', systemList.charactersList)
router.get('/itemsHoldables', systemList.itemsHoldables)
router.get('/itemsHoldablesList', systemList.itemsHoldablesList)
router.get('/itemsTrinkets', systemList.itemsTrinkets)
router.get('/itemsClothes', systemList.itemsClothes)
router.get('/itemsEnergyShields', systemList.itemsEnergyShields)
router.get('/parts', systemList.parts)
router.get('/clues', systemList.clues)
router.get('/crises', systemList.crises)
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