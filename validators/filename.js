module.exports = (filename) => {
	
	// at least 1 characters long
	if (filename.length < 1) return 'must be at least 1 character long'

	// max 255 chars
	if (filename.length > 255) return 'must be shorter than 256 characters'

	// must meet the portable character set criteria
	// http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_276
	let re = /^[A-Za-z0-9._-]+/
	if (!re.test(filename)) return 'invalid filename'

	return 'valid'
}