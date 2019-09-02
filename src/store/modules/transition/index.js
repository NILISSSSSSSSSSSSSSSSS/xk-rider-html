const shouldUseTransition = !/transition=none/.test(location.href);
const state = {
    isLoading: false,
    direction: shouldUseTransition ? 'forward' : ''
};

const getters = {
    getIsLoading: (state) => {
        return state.isLoading;
    },
};

const action = {
    updateDemoPosition({ commit }, top) {
        commit({ type: 'updateDemoPosition', top: top })
    }
};

const mutations = {
    setIsLoading: (state, newValue) => {
        state.isLoading = newValue;
    },
    updateLoadingStatus(state, payload) {
        state.isLoading = payload.isLoading
    },
    updateDirection(state, payload) {
        if (!shouldUseTransition) {
            return
        }
        state.direction = payload.direction
    }
};


export default {
    namespaced: true,
    state,
    getters,
    action,
    mutations
}