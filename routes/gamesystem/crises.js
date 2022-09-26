const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function crisesList(req, res) {
    fetch(process.env.GAMESYSTEM_URL + '/crises', {
        method: 'GET',
    })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json({
            error: err
        }))
}

module.exports = crisesList