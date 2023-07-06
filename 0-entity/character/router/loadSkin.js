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
    method: 'POST',
    url: '/api/loadSkin',
    preHandler: upload.single('skin'),
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const getCharacterName = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id = ?`
        const getSkins = `SELECT skin FROM ${process.env.SKINS_TABLE_NAME} WHERE id = ?`
        return await Promise.all([
            connection
                .query(getCharacterName, [req.user.id]),
            connection
                .query(getSkins, [req.user.id])
        ])
            .then((result) => {
                if (!result[0].find((item) => item.character_name === req.body.name)?.character_name) reply.code(404).send({
                    message: 'Персонаж не найден'
                })
                else if (req.file?.mimetype !== 'image/png') reply.code(400).send({
                    message: 'Неверный тип файла'
                })
                else {
                    let skinName
                    req.body.tag ? skinName = req.body.name + '-' + req.body.tag : skinName = req.body.name
                    var skinPng = `${skinName}.png`
                    return new Promise(function(resolve, reject) {
                        fs.writeFile(path.resolve(`public/skins/${skinPng}`), req.file.buffer, (err) => {
                            if (err) reject('Ошибка записи')
                            else {
                                const getCharacterName = `UPDATE ${process.env.CHARACTER_TABLE_NAME} SET skin = ? WHERE character_name = ? `
                                const insertSkin = `INSERT INTO ${process.env.SKINS_TABLE_NAME} (id, skin) VALUES ( ?, ?)`
                                if (result[1].some((el) => el.skin === skinPng)) resolve()
                                else if(req.body.tag) connection
                                    .query(insertSkin, [req.user.id, skinPng])
                                    .then(() => resolve())
                                    .catch((err) => reject(err))
                                else Promise.all([
                                    connection
                                        .query(getCharacterName, [skinPng, req.body.name]),
                                    connection
                                        .query(insertSkin, [req.user.id, skinPng])
                                ])
                                    .then(() => resolve())
                                    .catch((err) => reject(err))
                            }
                        })
                    })
                }
            })
            .then(() => {
                reply.send({
                    messages: 'Скин успешно загружен',
                })
            })
            .catch((err) => {
                    reply.code(500).send({
                        message: err
                    })
                }
            )
            .finally(() => connection.release())
    },
    schema: {
        response: {
            default: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
            200: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'success',
                    }
                }
            },
        },
    },
}