const _ = require('lodash')
const moment = require('moment')

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
		pending_cache: [],
		add (login, password, prefix) {
			let user = new User(login)
			user.prefix = prefix || ''
			if (user.register(password)) {
				console.log('user ' + login + ' added successfully')
				return true
			}
			else {
				console.log('failed adding user')
				return false
			}
		},

		approve (...args) {
			if (args.length === 0) return false
			if (typeof args[0] === 'string') {
				let user = new User(token)
				if (user.exists) {
					user.approved = true
					console.log('user ' + token + ' approved successfully')
					return true
				} else {
					console.log('failed to approve user')
					return false
				}
			} else if (typeof args[0] === 'number') {
				_.each(args, (t) => {
					let user = new User(this.pending_cache[t])
					user.approved = true
					user.save()
				})
				console.log('users approved successfully')
				return true
			} else {
				return false
			}
		},

		disapprove (login) {
			let user = new User(login)
			if (user.exists) {
				user.approved = false
				console.log('user ' + login + ' disapproved successfully')
				return true
			} else {
				console.log('failed to disapprove user')
				return false
			}
		},

		info (login) {
			let user = new User(login)
			if (user.exists) {
				console.log(user)
				return true
			} else return false
		},

		list () {
			console.log(User.getAllLogins().join(', '))
			return true
		},

		pending () {
			let i = 0
			this.pending_cache = []
			User.getPending().forEach((u) => {
				this.pending_cache[i] = u.login
				console.log('[' + i++ + '] // ' + 
					u.login + ' // ' + new moment(u.date_created).calendar())
			})

			if (!i) console.log('nobody awaiting approval')
			
			return true
		},

		remove (login) {
			let user = new User(login)
			if (user.remove()) {
				console.log('user ' + login + ' removed successfully')
				return true
			} else return false
		}
	}
})

const help_text = `
available commands:
	users
		add login, password, [prefix]
		remove login
		approve login
		disapprove login
		info login
		pending 
	`

r.on('exit', () => {
	console.log('\nTerminating...')
	process.exit()
})

module.exports = r