const createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    rfs = require('rotating-file-stream'),
    history = require('connect-history-api-fallback'),
    cors = require('cors')


const api = require('./routes/api')

const app = express();
require('dotenv').config();

app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    next();
});


// view engine setup
app.use(history({
    rewrites: [
        {
            from: /^\/api\/.*$|^\/skins\/.*$/,
            to: function (context) {
                return context.parsedUrl.pathname;
            }
        }
    ]
}));
app.set('views', path.join(__dirname, 'views'));

const pad = num => (num > 9 ? '' : '0') + num
const generator = (time, index) => {
    if (!time) return path.normalize(__dirname + '/logs/server.log')
    const month = time.getFullYear() + '' + pad(time.getMonth() + 1)
    const day = pad(time.getDate())
    const hour = pad(time.getHours())
    const minute = pad(time.getMinutes())
    return path.normalize(__dirname + '/logs/' + `${month}-${month}${day}-${hour}${minute}-${index}-server.log`)
}

const rfsStream = rfs.createStream(generator, {
    size: '10M',
    interval: '1d',
    compress: 'gzip'
})

const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
    optionSuccessStatus: 200
}

app
    .use(logger('dev', {stream: rfsStream}))
    .use(express.json())
    .use(express.urlencoded({extended: false}))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')))
    .use('skins', express.static(path.join(__dirname, 'public/skins')))
    .use(cors(corsOptions))


if (process.env.NODE_ENV !== 'production') {
    app.use(logger('dev')) // console log
}


app.use('/api', api)


app.use(function (req, res, next) {
    next(createError(404));
});


app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};


    res.status(err.status || 500);
    res.json({error: err})
});

module.exports = app;
