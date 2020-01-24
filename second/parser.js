const splitter = (config) => {
  const split = (str, output = []) => {
    if (!str) {
      return output
    }

    const size = parseInt(str.substring(config.sizeStart, config.sizeEnd))
    const splitAt = size + config.sizeEnd
    const item = str.substring(0, splitAt)
    const remainingStr = str.substring(splitAt)

    return split(remainingStr, [...output, item])
  }

  return split
}

module.exports = (config = {
    sizeStart: 2,
    sizeEnd: 4
  }) => {

  return {
    split: splitter(config),

    item: (str = '') => ({
      ID: str.substring(0, config.sizeStart),
      value: str.substring(config.sizeEnd)
    })
  }
}