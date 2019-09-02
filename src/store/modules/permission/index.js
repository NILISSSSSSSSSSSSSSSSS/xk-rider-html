import { pTest } from "./../../../util/publicParams";
import { getPermission, getSession } from "./../../../util/publicMehotds";
const state = {};
const mutations = {
    setPermission(state, payload) {
        let permissions = getSession("xk-role")
            ? JSON.parse(getSession("xk-role"))
            : [];
        permissions.forEach(name => {
            state[name] =
                pTest || getPermission("riderCreate") || getPermission(name);
        });
    },
    canUse(state, payload) {
        return state[payload.key];
    }
};

export default {
    namespaced: true,
    state,
    mutations
};
