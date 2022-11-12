var jwtCheck = require('../../validator/jwtCheck'),
    pool = require('../../database'),
    fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)),
    cipher = require('../../crypto/cipher')

function createCharacter(req, res) {
    var character = `INSERT INTO ${process.env.CHARACTER_TABLE_NAME} (id,character_name,password) VALUES ( ?, ?, ? )`
    const timeStamp = new Date().getTime()
    var globalInfo = {}
    Promise.all([
        cipher(req.body.password),
        jwtCheck(req.headers.authorization.split(' ')[1], true)
    ])
        .then((result) => {
            globalInfo = result
            return fetch(process.env.GAMESYSTEM_URL + '/api', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    method: 'entity_create_new',
                    params: {
                        entity_class: 'PlayerEntity',
                        uid: req.body.name,
                        name: req.body.name,
                        display_name: req.body.display_name,
                        entity_type: 'UNKNOWN'
                    },
                    id: timeStamp,
                })
            })
        })
        .then((result) => {
            return result.json()
        })
        .then((info) => {
            if(info.error?.code) throw info.error
            else return pool(character, [globalInfo[1].id, req.body.name, globalInfo[0]])
        })
        .then(() => res.status(200).json({
            status: 'success'
        }))
        .catch((err) => {
            res.status(404).json(err)
        })
}

module.exports = createCharacter
