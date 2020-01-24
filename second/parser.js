module.exports = {
  split(str, output = []) {
    if (!str) {
      return output
    }
    return [...output, str]
  }
}