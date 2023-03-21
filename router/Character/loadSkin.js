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
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    preHandler: upload.single('skin'),
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        const getCharacterName = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id = ?`
        return await connection
            .query(getCharacterName, [req.user.id])
            .then((result) => {
                if (!result.find((item) => item.character_name === req.body.name)?.character_name) reply.code(404).send({
                    message: 'Персонаж не найден'
                })
                else if (req.file?.mimetype !== 'image/png') reply.code(400).send({
                    message: 'Неверный тип файла'
                })
                else {
                    let skinName
                    req.body.tag ? skinName = req.body.name + '-' + req.body.tag : skinName = req.body.name
                    return new Promise(function(resolve, reject) {
                        fs.writeFile(path.resolve(`public/skins/${skinName}.png`), req.file.buffer, (err) => {
                            if (err) reject('Ошибка записи')
                            if (req.body.tag) resolve()
                            else {
                                const getCharacterName = `UPDATE ${process.env.CHARACTER_TABLE_NAME} SET skin = ? WHERE character_name = ? `
                                connection
                                    .query(getCharacterName, [`${skinName}.png`, req.body.name])
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