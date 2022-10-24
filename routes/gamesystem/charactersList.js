const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)),
    pool = require('../../database'),
    jwtCheck = require('../../validator/jwtCheck')

function charactersList(req, res) {
    var characterCheck = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id = ?`
    Promise.all([
        jwtCheck(req.headers.authorization.split(' ')[1], true),
        fetch(process.env.GAMESYSTEM_URL + '/players', {
            method: 'GET',
        }),
    ])
        .then((result) => {
            return Promise.all([
                pool(characterCheck, result[0].id),
                result[1].json(),
            ])
        })
        .then((result) => {
            console.log(result[1]) // доделать
            if (!result[1][result[0][0].character_name]) return {message: 'Персонажей не существует'}
            else return result[1][result[0][0].character_name]
        })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json({
            error: err
        }))
}

module.exports = charactersList