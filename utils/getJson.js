export default async function getJson(connection, data, user){
    var jsonCheck = `SELECT char_json
                              FROM ${process.env.CHARACTER_TABLE_NAME}
                              WHERE id = ?
                                AND character_name = ? LIMIT 1`

    let promise = await new Promise(function(resolve, reject) {

        connection
            .query(jsonCheck, [user.id, data])
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