const express = require('express')
const passport = require('passport')
const loginValidator = require('../validators/login')
const passwordValidator = require('../validators/password')

const config = require('../config.json')
const User = require('../models/User')

const router = express.Router()

router.route('/login')
	.get((req, res) => {
		if (req.user) return res.redirect('/')
		res.render('login')
	})
	.post(passport.authenticate('local', {
			successRedirect: '/dashboard',
			failureRedirect: '/auth/login',
			failureFlash: true
		})
	)

router.route('/register')
	.get((req, res) => {
		res.render('register')
	})
	.post((req, res) => {
		console.log(req.body)
		let login = req.body.login
		let passwd1 = req.body.passwd1
		let passwd2 = req.body.passwd2
		
		if (login.length === 0 ||
			passwd1.length === 0 ||
			passwd2.length === 0) {
			req.flash('error', 'one or more forms are empty')
			return res.redirect('/auth/register')
		}

		if (passwd1 !== passwd2) {
			req.flash('error', 'passwords don\'t match')
			return res.redirect('/auth/register')
		}

		let lv = loginValidator(login)
		if (lv !== 'valid') {
			req.flash('error', 'login ' + lv)
			return res.redirect('/auth/register')
		}

		let pv = passwordValidator(passwd1)
		if (pv !== 'valid') {
			req.flash('error', 'password ' + pv)
			return res.redirect('/auth/register')
		}

		let user = new User(login)
		if (!user.register(passwd1)) {
			req.flash('error', 'something went wrong during registration')
			return res.redirect('/error')
		}

		if (config.users.requireApproval) {
			req.flash('info', 'account created successfully -- awaiting approval')
			res.redirect('/auth/login')
		} else {
			res.login(user, () => {
				if (!err)
					res.redirect('/auth/dashboard')
				else {
					res.flash('error', err)
					res.redirect('/error')
				}
			})
		}
	})

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

module.exports = router