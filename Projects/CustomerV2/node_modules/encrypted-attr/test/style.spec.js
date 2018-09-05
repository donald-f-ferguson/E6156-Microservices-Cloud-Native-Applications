'use strict'

const standard = require('mocha-standard')

describe('code style', function () {
  this.timeout(5000)

  it('should conform to standard', standard.files([
    'lib/**/*.js',
    '*.js'
  ]))
})

describe('code style in tests', function () {
  this.timeout(5000)

  it('should conform to standard', standard.files([
    'test/**/*.js'
  ], {
    globals: [
      'describe',
      'it',
      'before',
      'beforeEach',
      'after',
      'afterEach'
    ]
  }))
})
