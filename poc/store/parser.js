import CustomerDataParser from './../../second/customerDataParser'

export const state = () => ({
  parsed: null
})

export const mutations = {
  parsed(state, data) {
    state.parsed = data
  }
}

export const actions = {
  parse(context, payload) {
    context.commit('parsed', null)
    
    try {
      const output = CustomerDataParser.parse(payload)
      context.commit('parsed', output)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}