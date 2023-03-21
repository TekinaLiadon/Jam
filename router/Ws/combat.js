function supportConn(conn, timer) {
    clearInterval(timer.ping);
    timer.ping = setInterval(() => {
        if (!timer.userIsAlive) endConn(conn, timer)
         timer.userIsAlive = false
    }, 61000);
}
async function getCharInfo(fastify, data, req) {
    const connection = await fastify.mariadb.getConnection()
    var characterCheck = `SELECT character_name
                              FROM ${process.env.CHARACTER_TABLE_NAME}
                              WHERE id = ?
                                AND character_name = ? LIMIT 1`
    let promise = await new Promise(function(resolve, reject) {
        Promise.all([
            fastify.axios.get(process.env.GAMESYSTEM_URL + `/entities/${data.characterName}`),
            connection
                .query(characterCheck, [req.user.id, data.characterName]),
        ])
            .then((result) => {
                if (result[1].length === 1) resolve(result[0].data)
                else resolve('Данный персонаж не найден в списке персонажей')
            })
            .catch((err) => {
                reject(err)
            })
            .finally(() => connection.release())
    })
    return promise
}
function endConn(conn, timer) {
    clearInterval(timer?.characterInfo);
    clearInterval(timer?.ping);
    conn.end()
}

export default (conn, req, fastify) => {
    var timer = {
        characterInfo: undefined,
        ping: undefined,
        userIsAlive: undefined,
    }

    conn.socket.on('newListener', async () => {
        req.jwtVerify()
        supportConn(conn, timer)
    })
    conn.socket.on('message', async (message) => {
        let data = await JSON.parse(message.toString())
        try {
            const event = {
                ping() {
                    supportConn(conn, timer)
                    conn.socket.send(JSON.stringify({message: "pong"}))
                },
                charInfo() {
                    getCharInfo(fastify, data, req)
                        .then((result => conn.socket.send(JSON.stringify({message: result}))))
                        .catch((err) => conn.socket.send(JSON.stringify({message: err})))
                    timer.characterInfo = setInterval(() => {
                        getCharInfo(fastify, data, req)
                            .then((result => conn.socket.send(JSON.stringify({message: result}))))
                            .catch((err) => conn.socket.send(JSON.stringify({message: err})))
                    }, 30000);
                }
            }[data.event]()
        } catch (err){
            console.log(err) // логгировать
            conn.socket.send(JSON.stringify({message: "Неизвестный ивент"}))
        }
    })

    conn.socket.on('close', async () => {
        endConn(conn, timer)
    })
}