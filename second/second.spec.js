const parser = require('./parser')()
const expect = require('chai').expect

const SAMPLE_1 = '0101I040412347802MY12320010James_Bond01020202108888666699055000007330004Bond0105James0212770707148888'
const SAMPLE_2 = '0002010101I040412347802MY12320010James_Bond01020202108888666699055000007330004Bond0105James'
const SAMPLE_3 = '0002010101I040412347802MY12340010James_Bond0102020210888866666699055000007330004Bond0105James0212770707148888'

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

    const allSamples = [
      { str: SAMPLE_1, expected: 6 },
      { str: SAMPLE_2, expected: 7 },
      { str: SAMPLE_3, expected: 7 },
    ]
    allSamples.forEach((sample, i) => {
      it(`can split sample ${i}`, function () {
        expect(parser.split(sample.str)).has.lengthOf(sample.expected)
      })
    })
  })

  describe('parse item', function () {
    it('handle empty input', function () {
      const output = parser.item()
      expect(output).to.deep.equal({ID: '', value: ''})
    })

    it('can parse id and content', function () {
      const output = parser.item('000201')
      expect(output.ID).to.equal('00')
      expect(output.value).to.equal('01')
    })
  })
})