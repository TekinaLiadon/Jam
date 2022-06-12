const mariadb = require('mariadb');

async function asyncFunction(sql, request) {
    const conn = await mariadb.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_DATABASE,
    });

    try {
        const res = await conn.query(sql, request);
        return res;
    } finally {
        conn.end();
    }
}

module.exports = asyncFunction;