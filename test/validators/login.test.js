const expect = require('chai').expect
const _ = require('lodash')

const v = require('../../validators/login')

describe('login validator', () => {
	it('should allow legal usernames', () => {
		expect(v('PRO_NOSCOPER420@BLAZE.IT')).to.equal('valid')
	})
	
	it('should deny empty usernames', () => {
		expect(v('')).to.not.equal('valid')
	})

	it('should deny logins below 4 characters', () => {
		expect(v('kek')).to.not.equal('valid')
	})

	it('should deny logins above 64 characters', () => {
		expect(v(_.repeat('a', 65)))
			.to.not.equal('valid')
	})

	it('should allow logins of legal length', () => {
		expect(v('satanism')).to.equal('valid')
	})

	it('should deny illegal characters', () => {
		expect(v('cocaine💯')).to.not.equal('valid')
	})

	it('should allow non-illegal characters', () => {
		expect(v('am@zinguser_name69')).to.equal('valid')
	})

	it('should deny logins not starting with letter or number', () => {
		expect(v('__000_tab_enter_for_jenna_cat')).to.not.equal('valid')
	})

	it('should deny logins not starting with letter or number', () => {
		expect(v('000_tab_enter_for_jenna_cat__')).to.not.equal('valid')
	})
})