const express = require('express')

router = express.Router()

router.use('/auth', require('./auth'))
router.use('/dashboard', require('./dashboard'))
router.use('/error', require('./error'))

router.get('/', function (req, res) {
	if (req.user)
		res.redirect('/dashboard')
	else
		res.redirect('/auth/login')
})

module.exports = router