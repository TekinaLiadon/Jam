const pool = require(__dirname + '/database')

require('dotenv').config()

const globalTable = `CREATE TABLE ${process.env.CORE_TABLE_NAME} (id int NOT NULL AUTO_INCREMENT, username varchar(20) NOT NULL UNIQUE, password varchar(64), role varchar(20), access_token VARCHAR (30), refresh_token VARCHAR (30), PRIMARY KEY(id) )`
const additionalInfoTable =`CREATE TABLE ${process.env.ADDITIONAL_TABLE_NAME} (id INT, email varchar(20), blacklist boolean, discord_id varchar(20), FOREIGN KEY (id) REFERENCES ${process.env.CORE_TABLE_NAME}(id), PRIMARY KEY(id) )`
const characterTable = `CREATE TABLE ${process.env.PROJECT_NAME} (id int NOT NULL, character_name varchar(20) NOT NULL UNIQUE, password varchar(64), FOREIGN KEY (id) REFERENCES ${process.env.CORE_TABLE_NAME}(id), PRIMARY KEY(character_name) )`


async function init() {
    await pool(globalTable)
        .then(() => console.log('Основная таблица создана'))
        .catch((err) => console.log(err.text))
    await pool(additionalInfoTable)
        .then(() => console.log('Дополнительная таблица создана'))
        .catch((err) => console.log(err.text))
    await pool(characterTable)
        .then(() => console.log('Таблица персонажей создана'))
        .catch((err) => console.log(err.text))
    await console.log('Инициализация завершена')
    process.exit(-1)
}

init()