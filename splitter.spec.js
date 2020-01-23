const expect = require('chai').expect
const splitter = require('./splitter')

describe("splitter", function () {
  const params = [
    {str: '00020112', expectedID: '00', contentLength: 2, expectedContent: '01'},
    {str: '0101I12', expectedID: '01', contentLength: 1, expectedContent: 'I'},
    {str: '0101M12', expectedID: '01', contentLength: 1, expectedContent: 'M'},
  ]

  params.forEach(param => {
    it(`can identify ID and content [${param.str}]`, function () {
      const result = splitter.parse(param.str)
      expect(result.ID).equal(param.expectedID)
      expect(result.contentLength).equal(param.contentLength)
      expect(result.content).equal(param.expectedContent)
    })
  })

  it('can parse all', function () {
    const str = '0002010101M'
    const output = splitter.parseAll(str)
    expect(output).has.lengthOf(2)
    expect(output[0].content).equal('01')
    expect(output[1].content).equal('M')
  })
  
})
