var jwtCheck = require('../../validator/jwtCheck'),
    pool = require('../../database'),
    fs = require("fs"),
    path = require('path')


function loadSkin(req, res) {
    jwtCheck(req.headers.authorization.split(' ')[1], true)
        .then((result) => {
            const getCharacterName = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id = ?`
            return pool(getCharacterName, [result.id])
        })
        .then((result) => {
            if (!result.find((item) => item.character_name === req.body.name)?.character_name) res.status(500).json({
                error: 'Персонаж не найден'
            })
            else if (req.file?.mimetype !== 'image/png') res.status(500).json({
                error: 'Неверный тип файла'
            })
            else {
                let skinName
                req.body.tag ? skinName = req.body.name + '-' + req.body.tag : skinName = req.body.name
                fs.writeFile(path.resolve(`public/skins/${skinName}.png`), req.file.buffer, (err) => {
                    if (err) res.status(500).json({
                        error: 'Ошибка записи'
                    })
                    req.file.buffer = null // Явная отчистка памяти
                    if (req.body.tag) res.status(200).json({
                        messages: 'Скин успешно загружен'
                    })
                    else {
                        const getCharacterName = `UPDATE ${process.env.CHARACTER_TABLE_NAME} SET skin = ? WHERE character_name = ? `
                        return pool(getCharacterName, [`${skinName}.png`, req.body.name]).then(() => res.status(200).json({
                            messages: 'Скин успешно загружен'
                        }))
                    }
                })
            }
        })
        .catch((err) => {
                res.status(500).json({
                    error: err
                })
            }
        )
}

module.exports = loadSkin