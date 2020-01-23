const R = require('ramda')

module.exports = {
  parse(string) {
    return {
      ID: R.head(R.match(/^[0-9]{2}/, string))
    }
  }
}