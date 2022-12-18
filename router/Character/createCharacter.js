import { v4 as uuidv4 } from 'uuid'

export default {
    async handler(req, reply) {
        await this.auth(req, reply)
        const connection = await this.mariadb.getConnection()
        var character = `INSERT INTO ${process.env.CHARACTER_TABLE_NAME} (id,character_name,password,skin,uuid) VALUES ( ?, ?, ?, ?, ? )`
        var globalInfo = {}
        return await this.bcrypt.hash(req.body.password)
            .then((result) => {
                globalInfo.password = result
                globalInfo.uuid = uuidv4()
                return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/new',
                    JSON.stringify({
                        entity_class: 'PlayerEntity',
                        uuid: globalInfo.uuid,
                        name: req.body.name,
                        display_name: req.body.display_name,
                        entity_type: 'UNKNOWN',
                    }), {
                        headers: {'Content-Type': 'application/json'},
                    }
                )
            })
            .then((info) => {
                if (info.data.error?.code) throw info.data.error
                else return connection
                    .query(character, [req.user.id, req.body.name, globalInfo.password,
                    `default.png`, globalInfo.uuid])
            })
            .then(() => reply.send({
                status: 'success'
            }))
            .catch((err) => {
                reply.code(500).send(err)
            })
    },
    /*schema: schems.login,*/
}