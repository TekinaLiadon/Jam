const redirect = encodeURI('http://localhost:8080')


function loginUser(req, res) {
    res.json({
        url: `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=identify%20email%20guilds%20guilds.members.read&response_type=code&redirect_uri=${redirect}`
    })
}

module.exports = loginUser