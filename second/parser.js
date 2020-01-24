module.exports = {
  split(str, output = []) {
    if (!str) {
      return output
    }

    const size = parseInt(str.substring(2, 4))
    const splitAt = size + 4
    const item = str.substring(0, splitAt)
    const remainingStr = str.substring(splitAt)

    return this.split(remainingStr, [...output, item])
  }
}