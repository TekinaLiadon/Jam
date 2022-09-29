const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function itemsTrinketsList(req, res) {
    fetch(process.env.GAMESYSTEM_URL + '/items/trinkets', {
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

module.exports = itemsTrinketsList