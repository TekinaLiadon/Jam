/*import schems from "../../schems/index.js";*/
import multer from 'fastify-multer'
import fs from "fs"
import path from 'path'

const upload = multer({
    limits: {
        fieldSize: 548576,
        fields: 5,
        fileSize: 548576,
        headerPairs: 5,
    }
})

export default {
    preHandler: upload.single('skin'),
    async handler(req, reply) {
        await this.auth(req, reply)
        console.log(req.user)
        const connection = await this.mariadb.getConnection()
        const getCharacterName = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id = ?`
        return await connection
            .query(getCharacterName, [req.user.id])
            .then((result) => {
                if (!result.find((item) => item.character_name === req.body.name)?.character_name) reply.code(404).send({
                    text: 'Персонаж не найден'
                })
                else if (req.file?.mimetype !== 'image/png') reply.code(400).send({
                    text: 'Неверный тип файла'
                })
                else {
                    let skinName
                    req.body.tag ? skinName = req.body.name + '-' + req.body.tag : skinName = req.body.name
                    return fs.writeFile(path.resolve(`public/skins/${skinName}.png`), req.file.buffer, (err) => {
                        if (err) reply.code(500).send({
                            error: 'Ошибка записи'
                        })
                        if (req.body.tag) return {
                            messages: 'Скин успешно загружен'
                        }
                        else {
                            const getCharacterName = `UPDATE ${process.env.CHARACTER_TABLE_NAME} SET skin = ? WHERE character_name = ? `
                            return connection
                                .query(getCharacterName, [`${skinName}.png`, req.body.name])
                        }
                    })
                }
            })
            .then(() => {
                connection.release()
                reply.send({
                    messages: 'Скин успешно загружен'
                })
            })
            .catch((err) => {
                    connection.release()
                    reply.code(500).send({
                        text: err
                    })
                }
            )
    },
    /*schema: schems.login,*/
}