import {expect} from 'chai'
import Parser from './parser'
import Schema from './Schema'
import customerDataParser from './customerDataParser'

const parser = Parser()

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
      expect(parser.split('0002010101M')).to.deep.equal(['000201', '0101M'])
    })

    const allSamples = [{
        str: SAMPLE_1,
        expected: 6
      },
      {
        str: SAMPLE_2,
        expected: 7
      },
      {
        str: SAMPLE_3,
        expected: 7
      },
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
      expect(output).to.deep.equal({
        ID: '',
        value: ''
      })
    })

    const samples = [{
        str: '000201',
        ID: '00',
        value: '01'
      },
      {
        str: '0101M',
        ID: '01',
        value: 'M'
      },
      {
        str: '7802MY',
        ID: '78',
        value: 'MY'
      },
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
      const fooSchema = Schema({
        '00': {
          label: 'formatIndicator',
          type: Number
        },
        '01': {
          label: 'channelId',
          type: String
        }
      })

      expect(fooSchema([{
          ID: '00',
          value: '01'
        },
        {
          ID: '01',
          value: 'M'
        }
      ])).to.deep.equal({
        formatIndicator: 1,
        channelId: 'M'
      })
    })

    it('throw when missing required column', function () {
      const schema = Schema({
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

      expect(() => schema([{
        ID: '01',
        value: 'M'
      }])).to.throw()

      expect(() => schema([{
        ID: '00',
        value: 'I'
      }])).to.not.throw()
    })

    it('can parse value', function () {
      const mainSchema = Schema({
        '12': {
          label: 'name',
          type: (value) => value.replace(/_/g, ' ')
        }
      })

      expect(mainSchema([{
        ID: '12',
        value: 'John_Doe'
      }])).to.deep.equal({
        name: 'John Doe'
      })
    })

    it('can add default value', function () {
      const mainSchema = Schema({
        '00': {
          label: 'mandatory',
          type: Number,
          required: true
        },
        '04': {
          label: 'customerCategoryCode',
          type: String,
          defaultValue: '0000',
          required: true,
        }
      })

      expect(() => {
        const output = mainSchema([{
          ID: '00',
          value: '01'
        }])

        expect(output.customerCategoryCode).equal('0000')
      }).to.not.throw()

      
    })

    it('can add custom validation', function () {
      const passportOrNric = (data) => {
        if (data.passport && data.nric) {
          return false
        }

        return !!data.passport || !!data.nric
      }
      const schema = Schema({
        '00': {
          label: 'foo',
          type: Number
        },
        '01': {
          label: 'passport',
          type: String,
          validate: passportOrNric
        },
        '02': {
          label: 'nric',
          type: String,
          validate: passportOrNric
        }
      })

      expect(() => schema([{
        ID: '00',
        value: '01'
      }, {
        ID: '01',
        value: '012345678'
      }, {
        ID: '02',
        value: '850111-12-2233'
        }])).to.throw()
      
      expect(() => schema([{
        ID: '00',
        value: '01'
      },{
        ID: '02',
        value: '850111-12-2233'
      }])).to.not.throw()
      
      expect(() => schema([{
        ID: '00',
        value: '01'
      }, {
        ID: '02',
        value: '850111-12-2233'
      }])).to.not.throw()
      
      expect(() => schema([{
        ID: '00',
        value: '01'
      }])).to.throw()
    })
  })

  describe('CustomerData', function () {
    it('throw error if not starts with formatIndicator', function () {
      const sample = '0101I040412347802MY12340010James_Bond0102020210888866666699055000007330004Bond0105James0212770707148888000201'
      expect(() => customerDataParser.parse(sample)).to.throw()
    })

    it('throw error for sample 1', function () {
      expect(() => customerDataParser.parse(SAMPLE_1)).to.throw(/formatIndicator/)
    })

    it('throw error for sample 2', function () {
      expect(() => customerDataParser.parse(SAMPLE_2)).to.throw().with.property('errors').deep.equal(['nric','passport'])
    })

    it('able to parse sample 3', function () {
      const output = customerDataParser.parse(SAMPLE_3)
      console.log(output)
    })

    it('unprovided data should removed from final output', function () {
      const output = customerDataParser.parse(SAMPLE_3)
      expect(output).not.ownProperty('integrityCheck')
    })
  })
})