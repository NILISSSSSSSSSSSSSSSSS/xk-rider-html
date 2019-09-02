const state = {
    detail: null
};
const mutations = {
    saveDetail(state, payload) {
        if (payload) {
            state.detail = payload
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations
}