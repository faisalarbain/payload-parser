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

module.exports = () => {
  const config = {
    sizeStart: 2,
    sizeEnd: 4
  }

  return {
    split: splitter(config),

    item: (str = '') => ({
      ID: str.substring(0, 2),
      value: str.substring(4)
    }),

    schema: (rules) => (data) => {
      const validate = makeValidator(rules)
      const getValue = valueGetter(R.indexBy(R.prop('ID'), data))
      const process = R.pipe(
        R.mapObjIndexed((rule, ID) => ({
          ID,
          label: rule.label,
          value: rule.defaultValue,
          type: rule.type,
        })),
        R.values,
        R.indexBy(R.prop('label')),
        R.filter(data => getValue(data.ID, data.value)),
        R.map(data => data.type(getValue(data.ID, data.value))),
        data => {
          validate(data)
          return data
        }
      )

      return process(rules)
    }
  }
}