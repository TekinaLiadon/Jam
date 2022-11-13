


function loginUser(req, res) {
    if(req.query.redirect_url) {
        const redirect = encodeURI(req.query.redirect_url)
        res.json({
            url: `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=identify%20email%20guilds%20guilds.members.read&response_type=code&redirect_uri=${redirect}`
        })
    }
     else {
         const redirect = encodeURI(process.env.WEBSITE_URL)
         res.json({
            url: `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=identify%20email%20guilds%20guilds.members.read&response_type=code&redirect_uri=${redirect}`
        })
    }
}

module.exports = loginUser