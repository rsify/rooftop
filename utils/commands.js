const _ = require('lodash')
const moment = require('moment')

const User = require('../models/User')

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

module.exports = (cb) => { 
	return {
		help () {
			return cb(help_text)
		},
		users: {
			pending_cache: [],
			add (login, password, prefix) {
				let user = new User(login)
				user.prefix = prefix || ''
				if (user.register(password)) {
					cb('user ' + login + ' added successfully')
					return true
				}
				else {
					cb('failed to add user')
					return false
				}
			},

			approve (...args) {
				if (args.length === 0) return false
				if (typeof args[0] === 'string') {
					let token = args[0]
					let user = new User(token)
					if (user.exists) {
						user.approved = true
						user.save()
						cb('user ' + token + ' approved successfully')
						return true
					} else {
						cb('failed to approve user')
						return false
					}
				} else if (typeof args[0] === 'number') {
					_.each(args, (t) => {
						let user = new User(this.pending_cache[t])
						user.approved = true
						user.save()
					})
					cb('users approved successfully')
					return true
				} else {
					return false
				}
			},

			disapprove (login) {
				let user = new User(login)
				if (user.exists) {
					user.approved = false
					user.save()
					cb('user ' + login + ' disapproved successfully')
					return true
				} else {
					cb('failed to disapprove user')
					return false
				}
			},

			info (login) {
				let user = new User(login)
				if (user.exists) {
					cb(JSON.stringify(user))
					return true
				} else return false
			},

			list () {
				cb(User.getAllLogins().join(', '))
				return true
			},

			pending () {
				let i = 0
				this.pending_cache = []
				User.getPending().forEach((u) => {
					this.pending_cache[i] = u.login
					cb('[' + i++ + '] // ' + 
						u.login + ' // ' + new moment(u.date_created).calendar())
				})

				if (!i) cb('nobody awaiting approval')
				
				return true
			},

			remove (login) {
				let user = new User(login)
				if (user.remove()) {
					cb('user ' + login + ' removed successfully')
					return true
				} else return false
			}
		}
	}
}