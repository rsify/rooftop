module.exports = (filename) => {
	
	// at least 1 characters long
	if (filename.length < 1) return 'must be at least 1 character long'

	// max 255 chars
	if (filename.length > 255) return 'must be shorter than 256 characters'

	return 'valid'
}