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

    const samples = [
      {str: '000201', ID: '00', value:'01'},
      {str: '0101M', ID: '01', value:'M'},
      {str: '7802MY', ID: '78', value:'MY'},
    ]
    
    samples.forEach((sample) => {
      it(`can parse id and content for [${sample.str}]`, function () {
        const output = parser.item(sample.str)
        expect(output.ID).to.equal(sample.ID)
        expect(output.value).to.equal(sample.value)
      })
    })
  })

  describe('schema', function () {
    it('can create schema parser', function () {
      const fooSchema = parser.schema({
        '00': {
          label: 'formatIndicator',
          type: Number
        },
        '01': {
          label: 'channelId',
          type: String
        }
      })

      expect(fooSchema([
        {
          ID: '00',
          value: '01'
        },
        {
          ID: '01',
          value: 'M'
        }
      ])).to.deep.equal({
        formatIndicator: 01,
        channelId: 'M'
      })
    })

    it('throw when missing required column', function () {
      const schema = parser.schema({
        '00': {
          label: 'foo',
          type: String,
          required: true
        },
        '01': {
          label: 'bar',
          type: String,
        }
      })

      expect(() => schema([
        {
          ID: '01',
          value: 'M'
        }
      ])).to.throw()

      expect(() => schema([{
        ID: '00',
        value: 'I'
      }])).to.not.throw()
    })
  })
})