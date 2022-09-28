const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function characters(req, res) {
    fetch(process.env.GAMESYSTEM_URL + '/characters/' + req.query.charactersName, {
        method: 'GET',
    })
        .then((result) => {
            return result.json()
        })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json({
            error: err
        }))
}

module.exports = characters