const _ = require('lodash')
const bcrypt = require('bcryptjs')
const File = require('./File')
const loginValidator = require('../validators/login')
const passwordValidator = require('../validators/password')

const db = require('../utils/db')
db.defaults({users: []}).value()

const users = db.get('users')

const userDefaults = () => ({
    approved: false,
    date_accessed: 0,
    date_created: 0,
    entities: [],
    hash: '',
    prefix: ''
})

module.exports = class User {
	constructor (login) {
		this.login = login
		this.date_accessed = Date.now()

		this.retrieve()

		if (this.exists) this.save()
	}

	static getPending () {
		return users.filter({approved: false})
			.sortBy('date_created').reverse().value()
	}

	static getAllLogins () {
		let arr = []
		users.each((u) => {
			arr.push(u.login)
		}).value()
		return arr
	}

	get exists () {
		return !!this.date_created
	}

	addEntity (type, dir, name, id) {
		let entity
		switch (type) {
			case 'file':
				entity = {
					type: 'file',
					name: name,
					id: id
				}
				break;
			case 'dir':
				entity = {
					type:' dir',
					name: name,
					entities: []
				}
				break;
			default:
				return false
		}

		this.entities.push(entity)

		// '' 'dir/' 'dir/ledir/' 'dir/dir/fear/'
		// let dirArr = dir.split('/')
		
		// let ref = this.entities
		//
		// dirArr.forEach((p) => {
		// 	if (p == '') {
		// 		ref.push(entity)
		// 	} else {
		// 		if (typeof ref[p] === 'undefined')
		// 			return false
				
				
		// 	}
		// })

		return true
	}

	removeEntity (dir, id) {
		// let dirArr = dir.split('/')
		// 
		// let ref = this.entities

		let ent = _.find(this.entities, {id: id})
		if (ent.type === 'file') {
			let file = new File(ent.id)
			_.remove(this.entities, ent)
			return file.delete()
		} else {
			return false
		}
	}

	remove () {
		if (!this.exists) return false
		users.remove({login: this.login}).value()
		return true
	}

	register (pass) {
		_.defaults(this, userDefaults())

		// already exists
		if (users.find({login: this.login}).value()) return false

		// invalid login
		if (loginValidator(this.login, true) !== 'valid') return false
		
		// invalid password
		if (passwordValidator(pass) !== 'valid') return false	

		this.hash = bcrypt.hashSync(pass)

		this.date_created = Date.now()
		this.date_accessed = Date.now()

		/*
		try {
			let re = /^[^A-z]*([A-z]+)/
			this.prefix = re.exec(login)[1].substr(0, 5)
			
		} catch (e) {
			this.prefix = ''
		}
		*/
		
		this.save()

		return true
	}

	retrieve () {
		// pull existing data from db
		_.defaults(this, users.find({login: this.login}).value())
	}

	save () {
		// save the 'this' object to db
		let q = users.find({login: this.login})
		if (q.value())
			q.assign(this).value()
		else
			users.push(this).value()
	}

	verify (pass) {
		return bcrypt.compareSync(pass, this.hash)
	}
};