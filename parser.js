module.exports = {
  parse: (payload) => {
    if (payload.indexOf('00') !== 0) {
      throw "Format indicator must present as first data"
    }
  }
}