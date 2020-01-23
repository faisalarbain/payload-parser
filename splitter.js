const R = require('ramda')

const getContentLength = str => parseInt(str.substring(2, 4))

module.exports = {
  parse(string) {
    const contentLength = getContentLength(string)
    return {
      ID: string.substring(0,2),
      contentLength,
      content: 'fooo'
    }
  }
}