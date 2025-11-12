const defaultState = {
  customerList: [] as any[],
}

type accountManagementCenterState = {
  customerList: any[]
}
const mutations = {
  setCustomerList(state: accountManagementCenterState, data: any[]) {
    state.customerList = data
  },
}
const getters = {}
const actions = {}

export default {
  namespaced: true,
  state: defaultState,
  mutations,
  getters,
  actions,
}
