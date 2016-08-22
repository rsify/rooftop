const config = require('./config.json')
const express = require('express')
const passport = require('passport')

const LocalStrategy = require('passport-local')
const User = require('./models/User')

const app = express()

app.use(require('morgan')('dev', {
	skip(req, res) {
		// skip live page chrome extension 
		// request spam in terminal
		return req.url.indexOf('livePage=') !== -1
	}
}))

app.use(require('cookie-parser')(config.server.secret))

app.use(require('express-session')({
	secret: config.server.secret,
	resave: true,
	saveUninitialized: true
}))

app.use(require('express-flash')())

passport.serializeUser((user, cb) => {
	cb(null, user.login)
})

passport.deserializeUser((login, cb) => {
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
	(login, password, done) => {
		user = new User(login)
		
		if (!user.exists) 
			return cb(null, false)

		if (!user.verify(password)) 
			return cb(null, false)

		done(null, user)
	}
))

app.use((req, res, next) => {
	res.locals.user = req.user
	next()
})

app.set('view engine', 'pug')
app.use('/static', express.static(`${__dirname}/static`))
app.use(require('./routes'))
app.get('*', (req, res) => {
	req.flash('error', '404 not found')
	res.redirect('/error')
})

app.listen(config.server.port, () => {
	console.log(`listening on port ${config.server.port} yo`)
})

const repl = require('./utils/repl')