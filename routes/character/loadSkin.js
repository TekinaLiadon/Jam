var jwtCheck = require('../../validator/jwtCheck'),
    pool = require('../../database'),
    cipher = require('../../crypto/cipher'),
    fs = require("fs"),
    path = require('path')



function loadSkin(req, res) {
    let info = {
        validate: true,
        tag: '',
    }
    jwtCheck(req.headers.authorization.split(' ')[1], true)
        .then((result) => {
            const getCharacterName = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE id = ?`
            return pool(getCharacterName, [result.id])
        })
        .then((result) =>{
            if (!result.find((item) => item.character_name === req.body.name)?.character_name) res.status(500).json({
                error: 'Персонаж не найден'
            })
            else if (req.file.mimetype !== 'image/png') res.status(500).json({
                error: 'Неверный тип файла'
            })
            else {
                let skinName
                req.body.tag ? skinName = req.body.name + '-' + req.body.tag : skinName = req.body.name
                fs.writeFile(path.resolve( `skins/${skinName}.png`), req.file.buffer, (err) => {
                    if (err) res.status(500).json({
                        error: 'Ошибка записи'
                    })
                    else res.status(200).json({
                        messages: 'Скин успешно загружен'
                    })
                })
            }
        })
        .catch((err) => res.status(500).json({
                error: err
            })
        )
}

module.exports = loadSkin