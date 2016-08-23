const _ = require('lodash')
const files = require('lowdb')('db.json')

module.exports = class File {
	constructor (id) {
		this.id = id

		_.extend(this, files.get(id).value())
	}
}