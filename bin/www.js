import Fastify from 'fastify'
import multer from 'fastify-multer'
import dotenv from 'dotenv'
import router from '../router/index.js'
import pino from 'pino'
import pinoPretty from 'pino-pretty'
import dbConnector from '../database/index.js'
import path from 'path'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename);

dotenv.config()
const envToLogger = {
    dev: {
        level: 'warn',
        prettifier: pinoPretty,
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
    production: {
        level: 'error',
        prettifier: pinoPretty,
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
                colorize: false,
                destination: path.join(__dirname, '..', 'logs' , 'server.log'),
            },
        },
    },
}
const fastify = Fastify({
    /*http2: true,*/
    logger: envToLogger[process.env.NODE_ENV] ?? true,
    trustProxy: true,
})
await fastify.register(import('@fastify/cors'), {
    origin: 'http://localhost:8080',
    credentials: true,
    optionSuccessStatus: 200
})
await fastify.register(import('@fastify/helmet'), {
        crossOriginResourcePolicy: false,
    }
)
await fastify.register(import('@fastify/rate-limit'), {
    max: 150,
    timeWindow: '1 minute'
})
await fastify.register(import('@fastify/compress')) //nginx ?


await fastify.register(dbConnector, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DATABASE,
})
    .register(import('../utils/jwtLogic.js'))
    .register(import('fastify-bcrypt'), {
        saltWorkFactor: 7
    })
    .register(import('@fastify/websocket'), {
        options: {
            maxPayload: 1048576,
        }
    })
    .register(import('fastify-axios'))
    .register(multer.contentParser)
    .register(router)
    .register(import('@fastify/static'), {
        root: path.join(__dirname, '..', 'public'),
    })
    .setNotFoundHandler((req, res) => {
        if (req.raw.url && req.raw.url.startsWith("/api")) {
            return res.status(404).send({
                success: false,
                error: {
                    kind: "user_input",
                    message: "Not Found",
                },
            });
        }
        else if (req.raw.url && req.raw.url.startsWith("/skins")) return res.sendFile(`${req.raw.url.slice(7)}.png`, path.join(__dirname, '..', 'public' , 'skins'))
        else if (req.raw.url === '/launcher/Stargazer.exe') return res.sendFile(`Stargazer.exe`, path.join(__dirname, '..', 'public' , 'launcher'))
        else if (req.raw.url === '/launcher/Stargazer.jar') return res.sendFile(`Stargazer.jar`, path.join(__dirname, '..', 'public' , 'launcher'))
        else res.status(200).sendFile("index.html");
    })

fastify.addHook('preSerialization', (request, reply, payload, done) => {
    /*if(request.headers?.authorization)
        console.log(request.headers.authorization,
            request.user,
            request.headers['x-forwarded-for'] || request.ip,
            request.protocol + '://' +request.hostname,
            request.headers['user-agent'],
            request.headers['sec-ch-ua-platform'],
            request.headers['sec-ch-ua'],
            request.headers['accept-language'],
        )*/
    done(null, payload)
})
fastify.addHook('preValidation', (req, reply, done) => {
    if(req.headers?.authorization || req.headers?.authorization?.length > 10) req.jwtVerify()
    done()
})

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

await fastify.listen({port: normalizePort(process.env.PORT || '3000')/*, host: '0.0.0.0'*/}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})