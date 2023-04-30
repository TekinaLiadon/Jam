
import isEqual from 'lodash.isequal'
function supportConn(conn, timer) {
    clearInterval(timer.ping);
    timer.ping = setInterval(() => {
        if (!timer.userIsAlive) endConn(conn, timer)
         timer.userIsAlive = false
    }, 61000);
}
async function getJson(fastify, data, req){
    const connection = await fastify.mariadb.getConnection()
    var jsonCheck = `SELECT char_json
                              FROM ${process.env.CHARACTER_TABLE_NAME}
                              WHERE id = ?
                                AND character_name = ? LIMIT 1`

    let promise = await new Promise(function(resolve, reject) {

            connection
                .query(jsonCheck, [req.user.id, data])
            .then((result) => {
                return JSON.parse(result[0].char_json)
            })
            .then((result) => {
                resolve(result)
            })
            .catch((err) => {
                reject(err)
            })
            .finally(() => connection.release())
    })
    return promise
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
async function saveJson(fastify, data, req) {
    const connection = await fastify.mariadb.getConnection()
    var jsonSave = `UPDATE ${process.env.CHARACTER_TABLE_NAME}
                    SET char_json = ?
                              WHERE id = ?
                                AND character_name = ? LIMIT 1`
    let promise = await new Promise( function(resolve, reject) {
        const json = JSON.stringify(data.json)
        connection
            .query(jsonSave, [json, req.user.id, data.characterName])
            .then((result) => {
                resolve(result)
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

    var charData = {}

    conn.socket.on('newListener', async () => {
        fastify.jwt.verify(req.query.token, (err, decoded) => {
            if (err) endConn(conn, timer)
            req.user = decoded
        })
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
                        .then((result => {
                            charData = result
                            saveJson(fastify, Object.assign({json: charData}, data), req)
                                .then(() => conn.socket.send(JSON.stringify({charData: result})))
                        }))
                        .catch((err) => conn.socket.send(JSON.stringify({message: err})))
                    timer.characterInfo = setInterval( () => {
                        getCharInfo(fastify, data, req)
                            .then((result => {
                                if(!isEqual(charData, result)) {
                                    charData = result
                                    saveJson(fastify, Object.assign({json: charData}, data), req)
                                        .then(() => conn.socket.send(JSON.stringify({charData: result})))
                                }
                            }))
                            .catch((err) => conn.socket.send(JSON.stringify({message: err})))
                    }, 30000);
                },
                async trinketInfo() {
                    const charJson = await getJson(fastify, data.characterName, req)
                    if (charJson.trinkets.some((el) => el.trinket._id === data.trinketName)) {
                        try {
                            const trinket = await fastify.axios.get(process.env.GAMESYSTEM_URL + `/items/trinkets/${data.trinketName}`)
                            conn.socket.send(JSON.stringify({trinket: trinket.data}))
                        } catch (e) {
                            conn.socket.send(JSON.stringify({message: 'Ошибка Апи'}))
                        }
                    }
                    else conn.socket.send(JSON.stringify({message: 'У вас нет такого тринкета'}))
                },
                async abilityInfo() {
                    const charJson = await getJson(fastify, data.characterName, req)
                    if (charJson) {
                        try {
                            const ability = await fastify.axios.get(process.env.GAMESYSTEM_URL + `/abilities/${data.abilityName}`)
                            console.log(ability.data)
                            conn.socket.send(JSON.stringify({ability: ability.data}))
                        } catch (e) {
                            conn.socket.send(JSON.stringify({message: 'Ошибка Апи'}))
                        }
                    }
                    else conn.socket.send(JSON.stringify({message: 'У вас нет такой абилки'}))
                },
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