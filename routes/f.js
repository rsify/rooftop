const express = require('express')
const path = require('path')
const fs = require('fs')
const File = require('../models/File')
const config = require('../config.json')

const router = express.Router()

router.get('/:id', (req, res) => {
	if (!req.params.id) {
		req.flash('error', 'bad request')
		res.redirect('/error')
	}

	let file = new File(req.params.id)

	let filePath = path.resolve(process.cwd(), config.files.storageDir, req.params.id)

	try {
		fs.statSync(filePath)
	} catch (e) {
		req.flash('error', 'file not found')
		return res.redirect('/error')
	}
	
	res.download(filePath, file.name)
})

module.exports = router