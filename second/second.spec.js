const parser = require('./parser')
const expect = require('chai').expect

describe.only('second attempt', function () {
  describe('splitter', function () {
    it('return empty array if nothing to split', function () {
      expect(parser.split()).to.deep.equal([])
    })

    it('return empty array if empty string', function () {
      expect(parser.split('')).to.deep.equal([])
    })

    it('return single array', function () {
      expect(parser.split('000201')).to.deep.equal(['000201'])
    })
  })
})