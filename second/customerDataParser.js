const R = require('ramda')
const parser = require('./parser')()

const nricOrPassport = (data) => {
  if (data.nric && data.passport) {
    return false
  }

  return !!data.nric || !!data.passport
}

const parse = (schema) => R.pipe(
  parser.split,
  R.map(parser.item),
  schema
)

const AccountInformation = parser.schema({
  '00': {
    label: 'accountHolderName',
    type: String,
    required: true
  },
  '01': {
    label: 'accountType',
    type: String,
    required: true
  },
  '02': {
    label: 'accountNumber',
    type: Number,
    required: true
  },
})

const CustomerPersonalDetails = parser.schema({
  '00': {
    label: 'surname',
    type: String,
    required: true
  },
  '01': {
    label: 'givenName',
    type: String,
    required: true
  },
  '02': {
    label: 'nric',
    type: Number,
    validate: nricOrPassport
  },
  '03': {
    label: 'passport',
    type: Number,
    validate: nricOrPassport
  },
})

const CustomerData = parser.schema({
  '00': {
    label: 'formatIndicator',
    type: Number,
    required: true,
  },
  '01': {
    label: 'channelId',
    type: String,
    required: true,
  },
  '12': {
    label: 'customerAccountInformation',
    type: parse(AccountInformation),
    required: true,
  },
  '04': {
    label: 'customerCategoryCode',
    type: Number,
    required: true,
    defaultValue: '0000',
  },
  '07': {
    label: 'customerPersonalDetails',
    type: parse(CustomerPersonalDetails),
    required: true,
  },
  '78': {
    label: 'countryCode',
    type: String,
    required: true,
  },
  '99': {
    label: 'postalCode',
    type: String,
    required: true,
  },
  '02': {
    label: 'integrityCheck',
    type: String,
  },
})

module.exports = {
  parse: (str) => {
    if (str.indexOf('00') !== 0) {
      throw "formatIndicator should present as the first data payload"
    }
    return parse(CustomerData)(str)
  },
}