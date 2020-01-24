const splitter = require('./splitter')

const parseContent = (parsed) => {
  return parsed.content
}

const splitAll = (string = '', config = {}, result = []) => {
  if (string.length == 0) {
    return result
  }

  const parsed = splitter.parse(string)
  return splitAll(parsed.remaining, config, [...result, {
    ID: parsed.ID,
    content: parseContent(parsed)
  }])
}

module.exports = (config = {}) => ({
  parse: (payload) => {
    if (payload.indexOf('00') !== 0) {
      throw "Format indicator must present as first data"
    }

    return splitAll(payload, config)
    
  }
})