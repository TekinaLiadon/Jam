const redirect = encodeURI('http://localhost:8080')


function loginUser(req, res) {
    res.json({
        url: `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`
    })
}

module.exports = loginUser