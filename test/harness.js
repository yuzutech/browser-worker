/* eslint-env mocha */
'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai')
chai.use(require('dirty-chai'))

module.exports = { expect: chai.expect }
