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

router.post('/upload', upload.single('file'), (req, res) => {
	let user = new User(req.user.login)
	let id = req.file.filename
	let name = req.file.originalname

	user.addEntity('file', '', name, id)

	let file = new File(req.file.filename)
	file.owner = user.login
	file.save()

	res.redirect('/dashboard')
})

module.exports = router