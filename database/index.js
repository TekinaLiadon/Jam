'use strict'
import fp from 'fastify-plugin'
import sqlstring from 'sqlstring'
import mariadb from 'mariadb'

function fastifyMariadb (fastify, options, next) {
    const connectionType = options.type
    delete options.type
    const name = options.name
    delete options.name
    const usePromise = options.promise
    delete options.promise

    _createConnection({ fastify, connectionType, options, usePromise }, (err, db) => {
        if (err) {
            return next(err)
        }

        const client = connectionType !== 'connection' ? db.pool : db.connection

        if (usePromise) {
            fastify.addHook('onClose', (fastify, done) => client.end().then(done).catch(done))
        } else {
            fastify.addHook('onClose', (fastify, done) => client.end(done))
        }

        if (name) {
            if (!fastify.mariadb) {
                fastify.decorate('mariadb', {})
            }

            if (fastify.mariadb[name]) {
                return next(new Error(`fastify-mariadb '${name}' instance name has already been registered`))
            }

            fastify.mariadb[name] = db
        } else {
            if (fastify.mariadb) {
                return next(new Error('fastify-mariadb has already been registered'))
            } else {
                fastify.decorate('mariadb', db)
            }
        }

        next()
    })
    next()
}

function _createConnection ({ fastify, connectionType, options, usePromise }, cb) {
    let client = {}
    if (connectionType !== 'connection') {
        client = mariadb.createPool(options.connectionString || options)

        sqlstring.pool = client
        sqlstring.query = client.query.bind(client)
        sqlstring.execute = client.execute.bind(client)
        sqlstring.getConnection = client.getConnection.bind(client)

        fastify
            .decorate('mariadb', {
                pool: sqlstring.pool,
                query: sqlstring.query,
                execute: sqlstring.execute,
                getConnection: sqlstring.getConnection,
            })
            .decorateRequest('mariadbPool', sqlstring.pool)
            .decorateRequest('mariadbQuery', sqlstring.query)
            .decorateRequest('mariadbExecute', sqlstring.execute)
            .decorateRequest('mariadbGetConnection', sqlstring.getConnection)

        if (!usePromise) {
            client.query('SELECT NOW()', (err) => cb(err, sqlstring))
        } else {
            client
                .query('SELECT NOW()')
                .then(() => cb(null, sqlstring))
                .catch((err) => cb(err, null))
        }
    } else {
        client = mariadb.createConnection(options.connectionString || options)

        if (!usePromise) {
            sqlstring.connection = client
            sqlstring.query = client.query.bind(client)
            sqlstring.execute = client.execute.bind(client)

            client.query('SELECT NOW()', (err) => cb(err, sqlstring))
        } else {
            client
                .then((connection) => {
                    sqlstring.connection = connection
                    sqlstring.query = connection.query.bind(connection)
                    sqlstring.execute = connection.execute.bind(connection)

                    connection
                        .query('SELECT NOW()')
                        .then(() => cb(null, sqlstring))
                })
                .catch((err) => cb(err, null))
        }
    }
}

export default fp(fastifyMariadb, {
    fastify: '4.x',
    name: '@fastify/mariadb'
})
/*module.exports = fp(fastifyMariadb, {
    fastify: '4.x',
    name: '@fastify/mariadb'
})
module.exports.default = fastifyMariadb
module.exports.fastifyMariadb = fastifyMariadb*/
