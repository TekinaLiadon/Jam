import { v4 as uuidv4 } from 'uuid'

export default {
    method: 'POST',
    url: '/api/createCharacter',
    preValidation: function (req, reply, done) {
        this.auth(req, reply)
        done()
    },
    preHandler: function (req, reply, done) {
        req.hash = new Promise((resolve, reject) => {
            this.bcrypt.hash(req.body.password)
                .then((hash) => resolve(hash))
                .catch((err) => reject(err))
        })
        req.uuid = uuidv4()
        done()
    },
    async handler(req, reply) {
        const connection = await this.mariadb.getConnection()
        var character = `INSERT INTO ${process.env.CHARACTER_TABLE_NAME} (id,character_name,password,skin,uuid,blacklist) VALUES ( ?, ?, ?, ?, ?, ? )`
        var characterCheck = `SELECT character_name FROM ${process.env.CHARACTER_TABLE_NAME} WHERE character_name = ? LIMIT 1`
        return await connection
            .query(characterCheck, [req.body.name])
            .then((result) => {
                if(result[0]?.character_name) throw {
                    message: 'Такой персонаж уже есть'
                }
                else return this.axios.post(process.env.GAMESYSTEM_URL + '/entities/new',
                    JSON.stringify({
                        entity_class: 'PlayerEntity',
                        uuid: req.uuid,
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
                else return req.hash.then((result) => {
                    return connection
                    .query(character, [req.user.id, req.body.name, result, `default.png`, req.uuid, 0])
                })
            })
            .then(() => reply.send({
                message: 'Персонаж успешно создан',
                status: 'success'
            }))
            .catch((err) => {
                reply.code(500).send(err)
            })
            .finally(() => connection.release())
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
                    message: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                    }
                }
            },
            500: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                    },
                    code: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            }
        },
        body: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 20,
                },
                password: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 64,
                },
                display_name: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 20,
                },
            },
            required: ['name', 'password', 'display_name'],
        }
    },
}