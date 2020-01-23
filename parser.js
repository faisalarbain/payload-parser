const splitter = require('./splitter')
module.exports = {
  parse: (payload) => {
    if (payload.indexOf('00') !== 0) {
      throw "Format indicator must present as first data"
    }

    return splitter.parseAll(payload)
    
  }
}