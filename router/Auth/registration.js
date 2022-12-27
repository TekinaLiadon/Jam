export default {
    method: 'POST',
    url: '/api/registration',
    async handler(req, reply) {
        let id = 0
        const connection = await this.mariadb.getConnection()
        return await this.bcrypt.hash(req.body.password)
            .then((hash) => {
                return connection.query(`INSERT INTO ${process.env.CORE_TABLE_NAME} (username,PASSWORD,role) VALUES ( ?, ?, ? )`, [req.body.username, hash, 'user', 1])
            })
            .then((result) => {
                id = parseInt(result.insertId, 10)
                return connection.query(`INSERT INTO ${process.env.ADDITIONAL_TABLE_NAME} (id, email ,blacklist) VALUES ( ?, ?, ? )`, [parseInt(result.insertId, 10), req.body.email || null, 0,])
            })
            .then(() => reply.send({
                    token: this.jwt.sign({
                        username: req.body.username,
                        id: id,
                        role: 'user'
                    }),
                }))
            .catch(err => err?.type === "SqlError" ? reply.code(500).send(err) : reply.send(err)) // code "ER_DUP_ENTRY" экранировать)
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
                    token: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'success'
                    },
                },
            },
            500: {
                type: 'object',
                properties: {
                    text: {
                        type: 'string',
                    },
                    status: {
                        type: 'string',
                        default: 'error'
                    }
                }
            },
        },
        body: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 20,
                },
                password: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 64,
                },
                email: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 20,
                },
            },
            required: ['username', 'password', 'email'],
        }
    },
}