const express = require('express')
const passport = require('passport')

const router = express.Router()

router.route('/login')
	.get((req, res) => {
		if (req.user) return res.redirect('/')
		res.render('login')
	})
	.post(
		passport.authenticate('local'),
		(req, res) => {
			res.redirect('/dashboard')
	})

router.route('/register')
	.get((req, res) => {
		res.render('register')
	})
	.post((req, res) => {
		req.flash('error', 'not implemented')
		res.redirect('/error')
	})

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

module.exports = router