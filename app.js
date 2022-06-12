const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const history = require('connect-history-api-fallback');

// const indexRouter = require('./routes/index');
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

app
    .use(logger('dev'))
    .use(express.json())
    .use(express.urlencoded({extended: false}))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')))

// app.use('/', indexRouter);
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
