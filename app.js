const config = require('./config.json')
const express = require('express')
const passport = require('passport')

const LocalStrategy = require('passport-local')
const User = require('./models/User')

const app = express()

app.use(require('morgan')('dev', {
	skip: function (req, res) {
		// skip live page chrome extension 
		// request spam in terminal
		return req.url.indexOf('livePage=') !== -1
	}
}))

app.use(require('express-session')({
	secret: config.server.secret,
	resave: true,
	saveUninitialized: true
}))

passport.serializeUser(function (user, cb) {
	cb(null, user.login)
})

passport.deserializeUser(function (login, cb) {
	user = new User(login)
	if (user.exists) 
		cb(null, user)
	else
		cb(new Error('User not found'))
})

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy({
		usernameField: 'login',
		passwordField: 'passwd'
	},
	function (login, password, done) {
		user = new User(login)
		
		if (!user.exists) 
			return cb(null, false)

		if (!user.verify(password)) 
			return cb(null, false)

		done(null, user)
	}
))

app.use(function (req, res, next) {
	res.locals.user = req.user
	next()
})

app.set('view engine', 'pug')
app.use('/static', express.static(__dirname + '/static'))
app.use(require('./routes'))

app.listen(config.server.port, function () {
	console.log(`listening on port ${config.server.port} yo`)
})

const r = require('repl').start({
	prompt: 'rooftop> ',
	useGlobal: true
})

r.on('exit', function () {
	console.log('\nTerminating...')
	process.exit()
})