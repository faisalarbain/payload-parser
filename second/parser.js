const R = require('ramda')

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
    },


    item(str = '') {
      return {
        ID: str.substring(0, 2),
        value: str.substring(4)
      }
    },

    schema(config) {
      return (data) => {
        return R.pipe(
          R.map(
            item => ({...item, ...config[item.ID]})
          ),
          R.indexBy(R.prop('label')),
          R.map(item => {
            return item.type(item.value)
          })
        )(data)
      }
    }
  }
}