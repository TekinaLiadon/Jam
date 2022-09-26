const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function charactersList(req, res) {
    fetch(process.env.GAMESYSTEM_URL + '/characters', {
        method: 'GET',
    })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json({
            error: err
        }))
}

module.exports = charactersList