var fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
var cipher = require('../../crypto/cipher')

function test (req, res){
    if (req.query.param === 'bcrypt') {
        cipher('req.body.password')
            .then((result) => {
                return res.status(200).json({
                    password: result,
                })
            })
            .catch(() => res.status(500))
    }
    else res.status(200).json({a:'a'})

    /*fetch(process.env.GAMESYSTEM_URL + '/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            method: 'entity_add_ability',
            params: {
                entity_id: 'f3a5df60-b18e-494f-b739-3d242e6f3af4',
                ability_name: 'thunder_cloud',
            },
            id: timeStamp,
        })
    })
        .then((result) => {
            return result.json()
        })
        .then((result) => {
            res.status(200).json(result)
        })*/
}

module.exports = test

/*
Добавление перка
fetch(process.env.GAMESYSTEM_URL + '/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            method: 'entity_add_perk',
            params: {
                entity_id: 'f3a5df60-b18e-494f-b739-3d242e6f3af4',
                perk: 'perfect_storm',
            },
            id: timeStamp,
        })
    })

    Добавление наративного перка
    fetch(process.env.GAMESYSTEM_URL + '/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            method: 'entity_add_narrative_perk',
            params: {
                entity_id: 'f3a5df60-b18e-494f-b739-3d242e6f3af4',
                perk_name: 'perfect_storm',
                description: 'Рыбатекст рыбатекст'
            },
            id: timeStamp,
        })
    })

    Добавление статы
    fetch(process.env.GAMESYSTEM_URL + '/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            method: 'entity_modify_skill',
            params: {
                entity_id: 'f3a5df60-b18e-494f-b739-3d242e6f3af4',
                skill: 'PSINERGICS',
                modifier: '10'
            },
            id: timeStamp,
        })
    })

    Добавление
    fetch(process.env.GAMESYSTEM_URL + '/api', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            method: 'entity_add_ability',
            params: {
                entity_id: 'f3a5df60-b18e-494f-b739-3d242e6f3af4',
                ability_name: 'perfect_storm',
            },
            id: timeStamp,
        })
    })
 */