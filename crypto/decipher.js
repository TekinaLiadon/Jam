const bcrypt = require('bcrypt');

function decyptedData(password, hash) {
    return new Promise ((resolve, reject) => {
        bcrypt.compare(password, hash, function(err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
}

module.exports = decyptedData
