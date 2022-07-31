const express = require('express'),
    pool = require('../../database'),
    jwt = require('jsonwebtoken'),
    cipher = require('../../crypto/cipher')


function registration(req, res) {
    const registrationSQL = `INSERT INTO global (username,PASSWORD,role) VALUES ( ?, ?, ? )`
    const projectReg = `INSERT INTO ${req.body.project} (id,blacklist,role) VALUES ( ?, ?, ? )`
    const sub_infoReg = `INSERT INTO sub_info (id, email, blacklist) VALUES ( ?, ?, ? )`
    let id = 0

    cipher(req.body.password)
        .then((result) => {
            return pool(registrationSQL, [req.body.username, result, 'user', 1])
        })
        .then((result) => {
            id = parseInt(result.insertId, 10)
            return Promise.all([
                pool(sub_infoReg, [parseInt(result.insertId, 10), req.body.email || null, 0,]),
                pool(projectReg, [parseInt(result.insertId, 10), 0, 'user'])
            ])
        })
        .then(() => {
            res.status(200).json({
                username: req.body.username,
                project: req.body.project,
                id: id,
                role: 'user',
                token: jwt.sign({
                    username: req.body.username,
                    project: req.body.project,
                    id: id,
                    role: 'user',
                }, process.env.TOKEN_KEY),
            })
        })
        .catch((err) => res.status(500).json({
                err: err.text
            })
        )
}

module.exports = registration