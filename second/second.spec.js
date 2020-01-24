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

    it('can split into 2 item', function () {
      expect(parser.split('0002010101M')).to.deep.equal(['000201','0101M'])
    })
  })
})