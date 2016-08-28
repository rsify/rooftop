const _ = require('lodash')
const path = require('path')
const config = require('../config.json')

const db = require('../utils/db')
db.defaults({files: []}).value()

const files = db.get('files')

module.exports = class File {
	constructor (id) {
		this.id = id
		this.date_created = Date.now()
		this.retrieve()
	}

	get exists () {
		return !!this.date_created
	}

	delete () {
		if (!this.exists) return false
		fs.unlinkSync(path.resolve(
			process.cwd(), config.files.storageDir, this.id))
		files.remove({id: this.id}).value()
		return true
	}

	retrieve () {
		_.defaults(this, files.find({id: this.id}).value())
	}

	save () {
		let q = files.find({id: this.id})
		if (q.value())
			q.assign(this).value()
		else
			files.push(this).value()
	}
}