const User = require('../models/User')

module.exports = (login, skipExistCheck = false) => {
	if (!login) return 'must not be empty'

	if (!skipExistCheck) {
		let user = new User(login)

		// can't already exist
		if (user.exists) return 'already taken'
	}

	// at least 4 chars long
	if (login.length < 4) return 'must be at least 4 characters'
	
	// shorter than 65 chars
	if (login.length > 64) return 'must be shorter than 65 characters'

	// must be ascii/numbers/@/_/. only
	let re1 = /^[A-Za-z0-9@\._-]+$/
	if (!re1.test(login)) return 'contains illegal characters'

	// must start with ascii/number
	let re2 = /^[A-Za-z0-9]$/
	if (!re2.test(login[0])) 
		return 'must start with a letter or a number'

	// must end with ascii/number
	if (!re2.test(login[login.length - 1])) 
		return 'must end with a letter or a number'

	return 'valid'
}