const R = require('ramda')

const requiredValidator = (label) => (data) => !!data[label] 

const makeValidator = (config) => (data) => {
  return R.pipe(
    R.map((rule) => R.allPass([
      rule.required ? requiredValidator(rule.label) : R.always(true),
      rule.validate || R.always(true)
    ])),
    R.map((validator) => {
      return validator(data)
    }),
    R.filter(data => !data),
    R.keys,
    errors => {
      if (errors.length > 0) {
        const labels = errors.map(e => config[e].label)
        throw {
          data,
          errors: labels,
          message: `Validation failed [${labels.join(', ')}]`
        }
      }
    }
  )(config)
}

const valueGetter = (data) => (ID, defaultValue) => {
  if (data[ID]) {
    return data[ID].value
  }

  return defaultValue
}

const split = (config, str, output = []) => {
  if (!str) {
    return output
  }

  const size = parseInt(str.substring(config.sizeStart, config.sizeEnd))
  const splitAt = size + config.sizeEnd
  const item = str.substring(0, splitAt)
  const remainingStr = str.substring(splitAt)


  return split(config, remainingStr, [...output, item])
}

module.exports = () => {
  const config = {
    sizeStart: 2,
    sizeEnd: 4
  }
  return {
    split(str) {
      return split(config, str)
    },

    item(str = '') {
      return {
        ID: str.substring(0, 2),
        value: str.substring(4)
      }
    },

    schema(config) {
      return (data) => {
        const getValue = valueGetter(R.indexBy(R.prop('ID'), data))
        const validate = makeValidator(config)
        
        return R.pipe(
          R.mapObjIndexed((rule, ID) => {
            const value = getValue(ID, rule.defaultValue)
            return {
              label: rule.label,
              value: value ? rule.type(value) : undefined,
            }
          }),
          R.filter( data => data.value !== undefined),
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