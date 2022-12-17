/*import schems from "../../schems/index.js";*/


export default {
    async handler(req, reply) {
        if(req.query.redirect_url) {
            const redirect = await encodeURI(req.query.redirect_url)
            return await reply.send({
                url: `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=identify%20email%20guilds%20guilds.members.read&response_type=code&redirect_uri=${redirect}`
            })
        }
        else {
            const redirect = await encodeURI(process.env.WEBSITE_URL)
            return await reply.send({
                url: `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=identify%20email%20guilds%20guilds.members.read&response_type=code&redirect_uri=${redirect}`
            })
        }
    },
    /*schema: schems.login,*/
}