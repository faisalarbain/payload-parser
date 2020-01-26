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
    context.commit('parsed', payload)
  }
}