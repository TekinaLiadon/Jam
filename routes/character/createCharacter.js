var jwtCheck = require('../../validator/jwtCheck'),
    pool = require('../../database'),
    cipher = require('../../crypto/cipher')

function createCharacter(req, res) {
    var character = `INSERT INTO ${process.env.CHARACTER_TABLE_NAME} (id,character_name,password) VALUES ( ?, ?, ? )`
    Promise.all([
        cipher(req.body.password),
        jwtCheck(req.headers.authorization.split(' ')[1], true)
    ])
        .then((info) => {
            return pool(character, [info[1].id, req.body.name, info[0]])
        })
        .then(() => res.status(200).json({
            status: 'success'
        }))
        .catch((err) => res.status(404).json(err) )
}

module.exports = createCharacter
