const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function clues(req, res) {
    fetch(process.env.GAMESYSTEM_URL + '/clues/' + req.query.cluesId, {
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

module.exports = clues