const mariadb = require('mariadb');

async function asyncFunction(sql, request) {
    const conn = await mariadb.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_DATABASE,
    });

    const res = await conn.query(sql, request)
        .catch((err) => console.log(err)) // Сделать запись в файл
        .finally(() => {
            conn.end();
        });
    return res
}

module.exports = asyncFunction;