const expect = require('chai').expect

const parser = require('./parser')

const SAMPLE_1 = '0101I040412347802MY12320010James_Bond01020202108888666699055000007330004Bond0105James0212770707148888'
const SAMPLE_2 = '0002010101I040412347802MY12320010James_Bond01020202108888666699055000007330004Bond0105James'
const SAMPLE_3 = '0002010101I040412347802MY12340010James_Bond0102020210888866666699055000007330004Bond0105James0212770707148888'

describe('parser', function () {
  describe('payload format indicator', function () {
    it('throw error when not present as first data', function () {
      
      expect(() => parser.parse(SAMPLE_1)).to.throw()
    })

    it('have no error when format indicator present', function () {
      expect(() => parser.parse(SAMPLE_2)).to.not.throw()
    })
  })

  describe('splits attributes', function () {
    it('can split attributes', function () {
      const str = '0002010101M'
      const output = parser.parse(str)
      expect(output).has.lengthOf(2)
      expect(output[0].content).equal('01')
      expect(output[1].content).equal('M')
    })
  })
})