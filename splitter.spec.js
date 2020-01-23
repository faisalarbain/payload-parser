const expect = require('chai').expect
const splitter = require('./splitter')

describe("splitter", function () {
  const params = [
    {str: '000201', expectedID: '00', contentLength: 2},
    {str: '0101I', expectedID: '01', contentLength: 1},
    {str: '0101M', expectedID: '01', contentLength: 1},
  ]

  params.forEach(param => {
    it(`can identify ID and content length [${param.str}]`, function () {
      const result = splitter.parse(param.str)
      expect(result.ID).equal(param.expectedID)
      expect(result.contentLength).equal(param.contentLength)
    })
  })
  
})
