express = require('express')
router = new express.Router()

router.get('/', function (req, res) {
	global.req = req // for
	global.res = res // debugging
	res.send('hello!')
})

module.exports = router
