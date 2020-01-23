const R = require('ramda')

const getContentLength = R.pipe(
  str => str.substring(2, 4),
  parseInt
)

module.exports = {
  parse(string) {
    const contentLength = getContentLength(string)
    return {
      ID: R.head(R.match(/^[0-9]{2}/, string)),
      contentLength,
    }
  }
}