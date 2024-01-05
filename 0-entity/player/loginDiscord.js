export default {
    method: 'GET',
    url: '/api/login/discord',
    async handler(req, reply) {
        if(req.query?.redirect_url) {
            const redirect = await encodeURI(req.query?.redirect_url)
            return await reply.send({
                url: `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=identify%20email%20guilds%20guilds&response_type=code&redirect_uri=${redirect}`
            })
        }
        else {
            const redirect = await encodeURI(process.env.WEBSITE_URL)
            return await reply.send({
                url: `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.DISCORD_ID}&scope=identify%20email%20guilds%20guilds&response_type=code&redirect_uri=${redirect}`
            })
        }
    },
    schema: {
        response: {
            default: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
            200: {
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'success'
                    }
                },
            },
        },
    },
}