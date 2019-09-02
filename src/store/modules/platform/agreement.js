const state = {
    list: []
};
const mutations = {
    saveList(state, payload) {
        if (payload) {
            state.list = payload
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations
}