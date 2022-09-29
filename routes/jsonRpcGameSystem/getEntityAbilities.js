const jwt = require('jsonwebtoken'),
    fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function entityAbilities(req, res) {
    const timeStamp = new Date().getTime()
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(404).json({message: 'Token not found'})
        })
    fetch(process.env.GAMESYSTEM_URL + '/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            method: 'entity_get_all_abilities',
            params: {
                entity_id: req.body.entityId,
                ability_type: req.body.abilityType,
                return_type: "both",
            },
            id: timeStamp,
        })
    })
        .then((result) => {
            return result.json()
        })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json({
            error: err
        }))
}

module.exports = entityAbilities