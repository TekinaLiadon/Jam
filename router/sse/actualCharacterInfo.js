var sendInterval = 10000;
var playerList = [];
var timerId;


export default {
    async handler(req, reply) {
        await this.auth(req, reply)
        const axios = this.axios
        function getCharacterInfo(info) {
            axios.get(process.env.GAMESYSTEM_URL + `/character/charsheet?player_id=${req.query.characterName}`)
                .then((result) => {
                    const strResult = JSON.stringify(result.data)
                    if (info?.data !== strResult) {
                        writeServerSendEvent(info.res, info.id, strResult);
                        clearInterval(timerId)
                        info.data = strResult
                    }
                    playerList.find((item) => item?.token === info.token).id = new Date().getTime()
                })
                .catch(() => {
                    playerList.splice(playerList.findIndex((item) => {
                        return item?.token === info.token
                    }), 1)
                    info.res.send()
                })
        }

        const updatePlayerInfo = async () => {
            return playerList.forEach((el) => {
                getCharacterInfo(el)
            })
        }
        function writeServerSendEvent(res, sseId, data) {
            res.send("data: " + data + '\n');
            res.send('id: ' + sseId + '\n\n');
        }

        const connect = async (req, reply) => {
            reply.headers({
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            })
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

            req.on('close', () => {
                playerList.splice(playerList.findIndex((item) => {
                    return item?.token === req.headers.authorization.split(' ')[1]
                }), 1)
            });
        }
        return await connect(req, reply)
    },
    /*schema: schems.login,*/
}