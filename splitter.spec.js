const expect = require('chai').expect
const splitter = require('./splitter')

describe("splitter", function () {
  const params = [
    {str: '000201', expected: '00'}
  ]

  params.forEach(param => {
    it(`can identify ID for [${param.str}]`, function () {
      const result = splitter.parse(param.str)
      expect(result.ID).equal(param.expected)
    })
  })
  
})
