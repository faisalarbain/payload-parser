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
        const indexedData = R.indexBy(R.prop('ID'), data)
        const getValue = (ID, defaultValue = '') => (indexedData[ID] || { value: defaultValue }).value
        
        return R.pipe(
          R.mapObjIndexed((rule, ID) => {
            return {
              label: rule.label,
              value: rule.type(getValue(ID, rule.defaultValue))
            }
          }),
          R.values,
          R.indexBy(R.prop('label')),
          R.map(R.prop('value'))
        )(config)
      }
    }
  }
}