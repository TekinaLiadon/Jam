const jwtCheck = require('../../validator/jwtCheck'),
    fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function getCharacterInfo(req, res) {
    const timeStamp = new Date().getTime()
    jwtCheck(req.headers.authorization.split(' ')[1], true)
        .then((token) => {
            Promise.all([
                fetch(process.env.GAMESYSTEM_URL + '/api', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        method: 'entity_get_all_abilities',
                        params: {
                            entity_id: req.body.entityId,
                            ability_type: req.body.abilityType,
                            return_type: "both",
                        },
                        id: timeStamp,
                    })
                }),
                fetch(process.env.GAMESYSTEM_URL + '/api', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        method: 'entity_get_all_perks',
                        params: {
                            entity_id: req.body.entityId,
                        },
                        id: timeStamp,
                    })
                }),
                fetch(process.env.GAMESYSTEM_URL + '/api', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        method: 'entity_get_all_statuses',
                        params: {
                            entity_id: req.body.entityId,
                        },
                        id: timeStamp,
                    })
                }),
            ])
                .then((result) => {
                    return Promise.all([
                        result[0].json(),
                        result[1].json(),
                        result[2].json(),
                    ])
                })
                .then((result) => res.status(200).json(result))
                .catch((err) => res.status(500).json({
                    error: err
                }))

        })
        .catch((err) => res.status(404).json(err) )
}

module.exports = getCharacterInfo