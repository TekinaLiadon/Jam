const bcrypt = require('bcrypt');
const saltRounds = 7;

function hashingPassword(data) {
    return new Promise ((resolve, reject) => {
        bcrypt.hash(data, saltRounds, function(err, hash) {
            resolve(hash)
        });
    })
}

module.exports = hashingPassword