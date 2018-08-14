const state = {
  fileListSelect: false
}

const mutations = {
  FILE_LIST_SELECT (state, value) {
    console.log('FILE_LIST_SELECT', value)
    state.fileListSelect = value
  }
}

const actions = {
  FILE_LIST_SELECT ({ commit }, value) {
    // do something async
    commit('FILE_LIST_SELECT', value)
  }
}

const getters = {
  FILE_LIST_SELECT (state) {
    return state.fileListSelect
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
