const state = {
    type: {}
};
const mutations = {
    saveType(state, payload) {
        if (payload.key && payload.setting) {
            state.type[`${payload.key}`] = payload.setting
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations
}