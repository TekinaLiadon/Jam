const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function itemsHoldablesList(req, res) {
    fetch(process.env.GAMESYSTEM_URL + '/items/holdables/', {
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

module.exports = itemsHoldablesList