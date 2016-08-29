const express = require('express')
const multer = require('multer')
const config = require('../config.json')
const User = require('../models/User')
const File = require('../models/File')
const requireAuth = require('../utils/requireAuth')

const upload = multer({dest: 'uploads/'})
const router = express.Router()

router.use(requireAuth)

router.get('/', (req, res) => {
	res.render('dashboard')
})

router.post('/files/upload', upload.single('file'), (req, res) => {
	let user = new User(req.user.login)
	let id = req.file.filename
	let name = req.file.originalname

	user.addEntity('file', '', name, id)

	let file = new File(req.file.filename)
	file.owner = user.login
	file.name = name
	file.save()

	res.redirect('/dashboard')
})

router.post('/files/delete', (req, res) => {
	if (!req.body.id) {
		req.flash('error', 'invalid request')
		return res.redirect('/dashboard')
	}

	let user = new User(req.user.login)

	if (user.removeEntity('', req.body.id)) {
		req.flash('success', 'entity deleted')
	} else {
		req.flash('error', 'entity doesn\'t exist')
	}

	res.redirect('/dashboard')
})

module.exports = router