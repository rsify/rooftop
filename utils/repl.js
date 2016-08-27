const _ = require('lodash')

const r = require('repl')

let ctx = require('./commands')(console.log)

let options = {
	prompt: 'rooftop> ',
	useGlobal: true,
	context: ctx
}

module.exports.start = () => {
	const repl = r.start(options)

	repl.on('exit', () => {
		console.log('\nTerminating...')
		process.exit()
	})

	_.extend(repl.context, ctx)

	return repl
}

module.exports.ctx = () => _.cloneDeep(ctx)