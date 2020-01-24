module.exports = () => {
  const config = {
    sizeStart: 2,
    sizeEnd: 4
  }
  return {
    split(str, output = []) {
      if (!str) {
        return output
      }

      const size = parseInt(str.substring(config.sizeStart, config.sizeEnd))
      const splitAt = size + config.sizeEnd
      const item = str.substring(0, splitAt)
      const remainingStr = str.substring(splitAt)

      return this.split(remainingStr, [...output, item])
    }
  }
}