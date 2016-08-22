const _ = require('lodash')

const User = require('../models/User')

const r = require('repl').start({
	prompt: 'rooftop> ',
	useGlobal: true
})

_.extend(r.context, {
	help () {
		console.log(help_text)
	},
	users: {
		add (login, password, subdomain) {
			console.log('not implemented')
		},

		approve (login) {
			console.log('not implemented')
		},

		info (login) {
			console.log('not implemented')
		},

		pending () {
			console.log('not implemented')
		},

		remove (login) {
			console.log('not implemented')
		}
	}
})

const help_text = `
available commands:
	users
		add login, password, [subdomain]
		approve login
		info login
		remove login
		pending 
	`

r.on('exit', () => {
	console.log('\nTerminating...')
	process.exit()
})

module.exports = r