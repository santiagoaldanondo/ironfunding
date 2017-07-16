const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passportConfig = require('./config/passport')

const index = require('./routes/index')
const auth = require('./routes/auth')
const campaigns = require('./routes/campaigns')
const rewards = require('./routes/rewards')

const app = express()
mongoose.connect('mongodb://localhost:27017/ironfunds-development')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('layout', 'layouts/main-layout')
app.use(expressLayouts)

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(session({
  secret: 'ironfundingdev',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))

// Passport
const passport = passportConfig()
app.use(passport.initialize())
app.use(passport.session())

// Static
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')))
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components/')))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  if (typeof (req.user) !== 'undefined') {
    res.locals.userSignedIn = true
    res.locals.username = req.user.username
  } else {
    res.locals.userSignedIn = false
  }
  next()
})

app.use('/', index)
app.use('/', auth)
app.use('/', rewards)
app.use('/campaigns', campaigns)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
