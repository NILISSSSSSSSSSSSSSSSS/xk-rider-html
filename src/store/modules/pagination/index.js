const state = {};
const mutations = {
    savePage(state, payload) {
        if (payload.key && payload.page) {
            state[`${payload.key}`] = payload.page
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations
}