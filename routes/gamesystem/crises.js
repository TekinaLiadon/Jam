const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function crises(req, res) {
    fetch(process.env.GAMESYSTEM_URL + '/crises' + req.query.crisesId, {
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

module.exports = crises