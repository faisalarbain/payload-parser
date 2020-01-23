const expect = require('chai').expect

const parser = require('./parser')

describe('parser', function () {
  describe('payload format indicator', function () {
    it('must present as the first data payload', function () {
      const sample1 = '0101I040412347802MY12320010James_Bond01020202108888666699055000007330004Bond0105James0212770707148888'
      expect(() => parser.parse(sample1)).to.throw()
    })
  })
})