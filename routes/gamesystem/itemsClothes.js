const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function itemsClothesList(req, res) {
    fetch(process.env.GAMESYSTEM_URL + '/items/clothes/', {
        method: 'GET',
    })
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json({
            error: err
        }))
}

module.exports = itemsClothesList