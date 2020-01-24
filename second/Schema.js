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

module.exports = (rules) => (data) => {
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