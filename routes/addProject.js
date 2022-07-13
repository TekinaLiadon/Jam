const pool = require('../database/index'),
    jwt = require('jsonwebtoken')

function addProject(req, res) {
    const adminCheck = `SELECT role FROM global WHERE username = ? AND role = 'admin'`
    const addProject = `CREATE TABLE ${req.body.project} (username varchar(20) NOT NULL UNIQUE, role varchar(20), hash varchar(64), blacklist boolean )`
    const addColumn = `ALTER TABLE global ADD COLUMN ${req.body.project} varchar(20)`
    jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.TOKEN_KEY, function (err, decoded) {
            if (!decoded) res.status(404).json({message: 'Token not found'})
            else {
                pool(adminCheck, [decoded.username])
                    .then((result) => {
                        return result[0]?.role ?
                            Promise.all([
                                pool(addProject, []),
                                pool(addColumn, [])
                            ]) : 'No rights'
                    })
                    .then((result) => {
                        if (result === 'No rights') res.status(200).json({
                            message: 'Error'
                        })
                        else res.status(200).json({
                            message: 'Add project'
                        })
                    })
                    .catch(() => res.status(500))
            }
        })
}

module.exports = addProject