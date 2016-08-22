const express = require('express')
const requireAuth = require('../utils/requireAuth')

const router = express.Router()

router.get('/', requireAuth, (req, res) => {
	res.render('dashboard')
})

module.exports = router