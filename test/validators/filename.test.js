const expect = require('chai').expect
const _ = require('lodash')

const v = require('../../validators/filename')

describe('filename validator', () => {
	it('should allow legal filenames', () => {
		expect(v('legal.txt')).to.equal('valid')
	})

	it('should deny empty filenames', () => {
		expect(v('')).to.not.equal('valid')
	})

	it('should deny long filenames', () => {
		expect(v(_.repeat('a', 256))).to.not.equal('valid')
	})
})