var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
require('dotenv').config();
const { createClient } = require('redis');
const connectRedis = require('connect-redis');
// const redisClient = createClient({ legacyMode: true });
const redisClient = createClient({
  legacyMode: true,
  socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
  },
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

const RedisStore = connectRedis(session);

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient
.connect()
.then((e) => console.log('Redis Client Connected'))
.catch(e => console.log(`Count not connect to redis : `, e));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie
    maxAge: 1000 * 60 * 10, // session max age in milliseconds
  },
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/hello', (req, res) => {
  if(req.session.viewCount === undefined) {
    req.session.viewCount = 0;
  } else {
    req.session.viewCount++; 
  }
  res.status(200).send({ session : `View count is : req.session.viewCount`});
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
