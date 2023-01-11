var sendInterval = 10000;
var playerList = [];
var timerId;


export default {
    method: 'GET',
    url: '/api/actualCharacterInfo',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    handler(req, reply) {
        var axios = this.axios
        var indexPlayer = playerList.findIndex((item) => {
            return item?.token === req.headers.authorization.split(' ')[1]
        })

        if (indexPlayer === -1) {
            const playerInfo = {
                token: req.headers.authorization.split(' ')[1],
                id: new Date().getTime(),
                req,
                reply,
            }
            playerList.push(playerInfo)
            getCharacterInfo(playerInfo)
        }

        if (playerList.length === 1) {
            clearInterval(timerId)
            timerId = setInterval(updatePlayerInfo, sendInterval); // Заменить на неблокирующий
        }

        function getCharacterInfo(info) {
            return axios.get(process.env.GAMESYSTEM_URL + `/entities/${info.req.query.characterName}`)
                .then((result) => {
                    const strResult = JSON.stringify(result.data)
                    const id = new Date().getTime()
                    if (info?.data !== strResult) {
                        info.reply.sse({id, data: strResult})
                        info.data = strResult
                    }
                    playerList.find((item) => item?.token === info.token).id = id
                })
                .catch((err) => {
                    playerList.splice(playerList.findIndex((item) => {
                        return item?.token === info.token
                    }), 1)
                    info.reply.sse({id: new Date().getTime(), data: err.data?.message})
                    info.reply.sse({event: 'end'});
                })
        }

        async function updatePlayerInfo() {
            return playerList.forEach((el) => {
                getCharacterInfo(el)
            })
        }

        req.socket.on('close', () => {
            playerList.splice(playerList.findIndex((item) => {
                return item?.token === req.headers.authorization.split(' ')[1]
            }), 1)
            reply.sse({event: 'end'});
        });

        return
    },
}