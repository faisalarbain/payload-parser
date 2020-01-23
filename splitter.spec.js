const expect = require('chai').expect
const splitter = require('./splitter')

describe("splitter", function () {
  const params = [
    {str: '000201', expectedID: '00'},
    {str: '0101l', expectedID: '01'},
    {str: '0101M', expectedID: '01'},
  ]

  params.forEach(param => {
    it(`can identify ID for [${param.str}]`, function () {
      const result = splitter.parse(param.str)
      expect(result.ID).equal(param.expectedID)
    })
  })
  
})
