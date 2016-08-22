const expect = require('chai').expect
const _ = require('lodash')

const v = require('../../validators/password')

describe('password validator', () => {
	it('should allow legal passwords', () => {
		expect(v('ąśóąą1239czxv.;\'\"')).to.equal('valid')
	})

	it('should deny empty passwords', () => {
		expect(v('')).to.not.equal('valid')
	})

	it('should deny long passwords', () => {
		expect(v(_.repeat('a', 129))).to.not.equal('valid')
	})
})