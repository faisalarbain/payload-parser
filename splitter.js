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
      content: string.substring(4, lastIndex),
      remaining: string.substring(contentLength + CONTENT_PAD_SIZE)
    }
  }
}