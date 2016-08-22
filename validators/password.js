module.exports = (password) => {
	
	// must be longer than 7 chars
	if (password.length < 8) return 'must be at least 8 characters'

	// must be max 128 chars long
	if (password.length > 128) return 'must be shorter than 129 characters'

	return 'valid'
}
