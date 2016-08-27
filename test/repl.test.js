const expect = require('chai').expect
const _ = require('lodash')
const sinon = require('sinon')

const User = require('../models/User')

let spy = sinon.spy()
const c = require('../utils/commands')(spy)

describe('repl commands', () => {
	describe('help', () => {
		it('should output something', () => {
			c.help()
			let out = spy.lastCall.args.join()
			expect(out).to.have.length.above(0)
			expect(out.indexOf('users')).to.not.equal(-1)
		})
	})
	describe('users', () => {
		before(() => {
			while (69) {
				this.login = Math.random().toString(32).substr(2, 8)
				let user = new User(this.login)
				if (!user.exists) break;
			}
			this.password = Math.random().toString(32).substr(2, 8)

			console.log('\ngenerated user:')
			console.log('\tlogin:', this.login)
			console.log('\tpassword:', this.password, '\n')
		})

		describe('add', () => {
			it('should add a new user and save it', () => {
				c.users.add(this.login, this.password)

				let user = new User(this.login)
				expect(user.exists).to.be.true
			})
		})

		describe('approve', () => {
			it('should approve the user', () => {
				c.users.approve(this.login)

				let user = new User(this.login)
				expect(user.approved).to.be.true
			})
		})

		describe('disapprove', () => {
			it('should disapprove the user', () => {
				c.users.disapprove(this.login)

				let user = new User(this.login)
				expect(user.approved).to.be.false
			})
		})

		describe('info', () => {
			it('should output something about the user', () => {
				c.users.info(this.login)
				let out = spy.lastCall.args.join()
				expect(out).to.have.length.above(0)
				expect(out.indexOf(this.login)).to.not.equal(-1)
			})
		})

		describe('list', () => {
			it('should output all users including the user', () => {
				c.users.list()
				let out = spy.lastCall.args.join()
				expect(out).to.have.length.above(0)
				expect(out.indexOf(this.login)).to.not.equal(-1)
			})
		})

		describe('pending', () => {
			it('should output pending users including the user', () => {
				c.users.pending()
				let out = spy.lastCall.args.join()
				expect(out).to.have.length.above(0)
				expect(out.indexOf(this.login)).to.not.equal(-1)
			})
		})

		describe('remove', () => {
			it('should remove the user', () => {
				c.users.remove(this.login)

				let user = new User(this.login)
				expect(user.exists).to.be.false
			})
		})
	})
})