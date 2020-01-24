const R = require('ramda')
const parser = require('./parser')()
const schema = require('./Schema')

const accountTypes = {
  '01': 'Savings',
  '02': 'Current',
  '03': 'HP',
  '04': 'Loan'
}

const AccountType = (value) => {
  if (!accountTypes[value]) {
    throw `Invalid Account Type [${value}]`
  }

  return accountTypes[value]
}

const nricOrPassportValidation = (data) => {
  if (data.nric && data.passport) {
    return false
  }

  return !!data.nric || !!data.passport
}

const parsePayload = (schema) => R.pipe(
  parser.split,
  R.map(parser.item),
  schema
)

const AccountInformation = schema({
  '00': {
    label: 'accountHolderName',
    type: String,
    required: true
  },
  '01': {
    label: 'accountType',
    type: AccountType,
    required: true
  },
  '02': {
    label: 'accountNumber',
    type: Number,
    required: true
  },
})

const CustomerPersonalDetails = schema({
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
    validate: nricOrPassportValidation
  },
  '03': {
    label: 'passport',
    type: Number,
    validate: nricOrPassportValidation
  },
})

const CustomerData = schema({
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
    type: parsePayload(AccountInformation),
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
    type: parsePayload(CustomerPersonalDetails),
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

const parseCustomerData = parsePayload(CustomerData)

const payloadPrecondition = (str) => {
  if (str.indexOf('00') !== 0) {
    throw "formatIndicator should present as the first data payload"
  }

  return str
}



module.exports = {
  parse: R.pipe(
    payloadPrecondition,
    parseCustomerData
  )
}