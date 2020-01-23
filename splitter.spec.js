const expect = require('chai').expect
const splitter = require('./splitter')

describe("splitter", function () {
  it('can identify ID', function () {
    const result = splitter.parse('000201')
    expect(result.ID).equal('00')
  })
})
