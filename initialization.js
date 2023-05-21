import dbConnector from "./database/index.js";
import Fastify from 'fastify'
import dotenv from "dotenv";
// доделать

dotenv.config()
const fastify = Fastify({
    logger: false,
})
fastify.register(dbConnector, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DATABASE,
})


const globalTable = `CREATE TABLE ${process.env.CORE_TABLE_NAME} (id int NOT NULL AUTO_INCREMENT, username varchar(20) NOT NULL UNIQUE, password varchar(64), role varchar(20), access_token VARCHAR (30), refresh_token VARCHAR (30), PRIMARY KEY(id) )`
const additionalInfoTable =`CREATE TABLE ${process.env.ADDITIONAL_TABLE_NAME} (id INT, email varchar(20), blacklist boolean, discord_id varchar(20), FOREIGN KEY (id) REFERENCES ${process.env.CORE_TABLE_NAME}(id), PRIMARY KEY(id) )`
const characterTable = `CREATE TABLE ${process.env.CHARACTER_TABLE_NAME} (id int NOT NULL, character_name varchar(20) NOT NULL UNIQUE, password varchar(64), skin VARCHAR (40), uuid VARCHAR (40), blacklist boolean, is_initialized boolean DEFAULT 0, FOREIGN KEY (id) REFERENCES ${process.env.CORE_TABLE_NAME}(id), PRIMARY KEY(character_name) )`

// ALTER TABLE () ADD () LONGTEXT ALTER TABLE sub_info ADD group_json LONGTEXT 

async function init() {
    const connection = await fastify.mariadb.getConnection()
    await connection
        .query(globalTable) .then(() => console.log('Основная таблица создана'))
        .catch((err) => console.log(err.text))
    await connection
        .query(additionalInfoTable)
        .then(() => console.log('Дополнительная таблица создана'))
        .catch((err) => console.log(err.text))
    await connection
        .query(characterTable)
        .then(() => console.log('Таблица персонажей создана'))
        .catch((err) => console.log(err.text))
    await console.log('Инициализация завершена')
    await connection.release()
    process.exit(-1)
}


init()