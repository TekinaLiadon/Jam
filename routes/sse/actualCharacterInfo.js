var header = require('../../utils/headers')
var fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

var sendInterval = 10000;
var playerList = [];
var timerId;

function connect(req, res) {
    res.writeHead(200, header.sse)
    res.flushHeaders()

    var indexPlayer = playerList.findIndex((item) => {
        return item?.token === req.headers.authorization.split(' ')[1]
    })

    if (indexPlayer === -1) {
        const playerInfo = {
            token: req.headers.authorization.split(' ')[1],
            id: new Date().getTime(),
            req,
            res,
        }
        playerList.push(playerInfo)
        getCharacterInfo(playerInfo)
    }

    if (playerList.length === 1) {
        clearInterval(timerId)
        timerId = setInterval(updatePlayerInfo, sendInterval); // Заменить на неблокирующий
    }

    req.on('close', () => {
        playerList.splice(playerList.findIndex((item) => {
            return item?.token === req.headers.authorization.split(' ')[1]
        }), 1)
    });
}

function getCharacterInfo(info) {
    fetch(process.env.GAMESYSTEM_URL + '/entities/' + info.req.query.charactersName, {
        method: 'GET',
    })
        .then((result) => {
            return result.json()
        })
        .then((result) => {
            const strResult = JSON.stringify(result)
            if (info?.data !== strResult) {
                writeServerSendEvent(info.res, info.id, strResult);
                info.data = strResult
            }
            playerList.find((item) => item?.token === info.token).id = new Date().getTime()
        })
        .catch(() => {
            playerList.splice(playerList.findIndex((item) => {
                return item?.token === info.token
            }), 1)
            info.res.end()
        })
}

async function updatePlayerInfo() {
    return playerList.forEach((el) => {
        getCharacterInfo(el)
    })
}
function writeServerSendEvent(res, sseId, data) {
    res.write("data: " + data + '\n');
    res.write('id: ' + sseId + '\n\n');
}

module.exports = connect