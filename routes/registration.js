const express = require('express'),
    pool = require('../database/index'),
    jwt = require('jsonwebtoken'),
    cipher = require('../crypto/cipher')


function registration(req, res) {
    const registrationSQL = `INSERT INTO global (username,PASSWORD,email,blacklist,role,${req.body.project}) VALUES ( ?, ?, ?, ?, ?, ? )`
    const projectReg = `INSERT INTO ${req.body.project} (username,blacklist,hash,role) VALUES ( ?, ?, ?, ? )`
    let hash = ''

    cipher(req.body.password)
        .then((result) => {
            return Promise.all([
                pool(registrationSQL, [req.body.username, result, req.body.email || null, 0, 'user', 1]),
                cipher(req.body.username),
            ])
        })
        .then((result) => {
            hash = result[1]
            return pool(projectReg, [req.body.username, 0, result[1], 'user'])
        })
        .then(() => res.status(200).json({
            username: req.body.username,
            project: req.body.project,
            token: jwt.sign({
                username: req.body.username,
                hash: hash,
                project: req.body.project
            }, process.env.TOKEN_KEY),
        }))
        .catch((err) => err ?
            res.status(400)
                .json({
                    error: err.text
                })
            : res.status(500)
        )
}

module.exports = registration