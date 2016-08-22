const express = require('express')
const passport = require('passport')

const /*:)*/ router = express.Router()

router.route('/')
	.get(function (req, res) {
		res.render('login')
	})
	.post(
		passport.authenticate('local'),
		function (req, res) {
			res.redirect('/dashboard')
	})

module.exports = router