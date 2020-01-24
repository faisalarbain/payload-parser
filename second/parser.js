const R = require('ramda')


const makeValidator = (config) => (data) => {
  return R.pipe(
    R.filter(data => data),
    R.map((validator) => {
      return validator(data)
    }),
    R.filter(data => !data),
    R.keys,
    errors => {
      if (errors.length > 0) {
        throw `Validation failed ${errors.join(', ')}`
      }
    }
  )(config)
}

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
        const validate = makeValidator(R.pluck('validate', config))
        return R.pipe(
          R.mapObjIndexed((rule, ID) => {
            const value = rule.type(getValue(ID, rule.defaultValue))

            if(rule.required && !value) {
              throw `${ID} is required`
            }

            return {
              label: rule.label,
              value,
            }
          }),
          R.values,
          R.indexBy(R.prop('label')),
          R.map(R.prop('value')),
          data => {
            validate(data)
            return data
          }
        )(config)
      }
    }
  }
}