const _ = require('lodash')
const users = require('lowdb')('db-users')
const bcrypt = require('bcryptjs')
console.log('hi')
const userDefaults = function () {
	return {
		access_granted: false,
		date_accessed: 0,
		date_created: 0,
		entities: [],
		hash: '',
		subdomain: ''
	}
}

module.exports = class User {
	constructor (login) {
		this.login = login
		this.date_accessed = Date.now()

		// pull existing data from db
		_.extend(this, users.get(login).value())

		if (this.exists) this.save()
	}

	get exists () {
		return !!this.date_created
	}

	register (pass) {
		_.defaults(this, userDefaults())

		this.hash = bcrypt.hashSync(pass)

		this.date_created = Date.now()
		this.date_accessed = Date.now()

		/*
		try {
			let re = /^[^A-z]*([A-z]+)/
			this.subdomain = re.exec(login)[1].substr(0, 5)
			
		} catch (e) {
			this.subdomain = ''
		}
		*/
		
		this.save()
	}

	save () {
		// save the 'this' object to db
		users.get(login).assign(this).value()
	}

	verify (pass) {
		return bcrypt.compareSync(pass, this.hash)
	}
}