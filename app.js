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

app.use(require('body-parser').urlencoded({extended: true}))
app.use(require('body-parser').json())
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
	let user = new User(login)
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
		let user = new User(login)
		
		if (!user.exists) 
			return done(null, false, {
				message: 'incorrect username or password'
			})

		if (!user.verify(password)) 
			return done(null, false, {
				message: 'incorrect username or password'
			})

		if (!user.approved && config.users.requireApproval)
			return done(null, false, {
				message: 'account not approved'
			})

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
	req.flash('error', `not found (${req.originalUrl})`)
	res.redirect('/error')
})

app.listen(config.server.port, () => {
	console.log(`listening on port ${config.server.port} yo`)
	require('./utils/repl').start()
})
