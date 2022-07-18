const createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    rfs = require('rotating-file-stream'),
    history = require('connect-history-api-fallback')


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
            from: /^\/api\/.*$/,
            to: function (context) {
                return context.parsedUrl.pathname;
            }
        }
    ]
}));
app.set('views', path.join(__dirname, 'views'));

const pad = num => (num > 9 ? '' : '0') + num
const generator = (time, index) => {
    if(!time) return path.normalize(__dirname +'/logs/server.log')
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

app
    .use(logger('dev', {stream: rfsStream}))
    .use(logger('dev')) // console log
    .use(express.json())
    .use(express.urlencoded({extended: false}))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')))





app.use('/api', api)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({error: err})
});

module.exports = app;
