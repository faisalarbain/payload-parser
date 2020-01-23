const R = require('ramda')

const getContentLength = str => parseInt(str.substring(2, 4))
const CONTENT_PAD_SIZE = 4

module.exports = {
  parse(string) {
    const contentLength = getContentLength(string)
    const lastIndex = contentLength + CONTENT_PAD_SIZE
    return {
      ID: string.substring(0,2),
      contentLength,
      content: string.substring(4, lastIndex)
    }
  },

  parseAll(string = '', result = []) {
    if (string.length == 0) {
      return result
    }
    
    const parsed = this.parse(string)
    const remaining = string.substring(parsed.contentLength + CONTENT_PAD_SIZE)
    return this.parseAll(remaining, [...result, parsed])
  }
}