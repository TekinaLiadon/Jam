export default async function (connection, id){
    var result = await connection.query(`SELECT role FROM ${process.env.CORE_TABLE_NAME} WHERE id = ? LIMIT 1`, [id])
    return result[0].role
}