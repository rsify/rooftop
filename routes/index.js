const express = require('express')

router = express.Router()

router.use('/login', require('./login'))
router.use('/dashboard', require('./dashboard'))

router.get('/', function (req, res) {
	res.render('index', {user: req.user})
})

module.exports = router