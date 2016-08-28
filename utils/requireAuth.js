module.exports = (req, res, next) => {
	global.req = req
	if (req.user) {
		return next()
	} else {
		res.redirect('/auth/login')
	}
}