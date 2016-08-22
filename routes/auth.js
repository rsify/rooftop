const express = require('express')
const passport = require('passport')

const router = express.Router()

router.route('/login')
	.get(function (req, res) {
		if (req.user) return res.redirect('/')
		res.render('login')
	})
	.post(
		passport.authenticate('local'),
		function (req, res) {
			res.redirect('/dashboard')
	})

router.route('/register')
	.get(function (req, res) {
		res.render('register')
	})
	.post(function (req, res) {
		res.redirect('/error', {error: 'not implemented'})
	})

router.get('/logout', function (req, res) {
	req.logout()
	res.redirect('/')
})

module.exports = router