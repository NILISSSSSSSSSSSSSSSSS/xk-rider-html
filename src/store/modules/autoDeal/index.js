const state = {
    IDCARD_AUTO_AUTH: {},
    HEALTHCAR_AUTO_AUTH: {},
    TWO_EXCEPTION_ORDER_AUTO_DISPATCH: {},
    CANCEL_ORDER_AUTO_AUTH: {},
};
const mutations = {
    saveState(state, payload) {
        if (payload.key && payload.info) {
            state[`${payload.key}`] = payload.page
        }
    }
}
const actions = {
    getAutoStatus(context, autoType) {
        let {
            type
        } = autoType;
        let api = Vue.prototype.$api.platformConfigDetail;
        let key = "";
        switch (type) {
            case "IDCARD_AUTO_AUTH":
                // api = Vue.prototype.$api.autoIDcheck;
                key = "IDcheck"
                break;
            case "HEALTHCAR_AUTO_AUTH":
                // api = Vue.prototype.$api.autoHealthCheck;
                key = "healthCheck"
                break;
            case "TWO_EXCEPTION_ORDER_AUTO_DISPATCH":
                // api = Vue.prototype.$api.autoErrorOrderLevelTwo;
                key = "errorOrderLevelTwo"
                break;
            case "CANCEL_ORDER_AUTO_AUTH":
                // api = Vue.prototype.$api.autoRefuseOrder;
                key = "refuseOrder"
                break;
            default:
                break;
        }
        console.log(key, api)
        Vue.prototype.$http.get(api, {
            configKey: type
        }, true).then(res => {
            console.log("​getAutoStatus -> res", res);
        }).catch(err => {
            console.log("​getAutoStatus -> err", err);
        })
        // context.commit('saveState')
    },
    setAutoStatus(context, autoType) {
        console.log(context.state[autoType.type])
        let {
            type,
            autoAuthIsOpen = 0,
            authDuration = "",
            authStatus = "",
            extraContent = ""
        } = autoType;
        let api = "";
        let key = "";
        switch (type) {
            case "IDCARD_AUTO_AUTH":
                api = Vue.prototype.$api.autoIDcheck;
                key = "IDcheck"
                break;
            case "HEALTHCAR_AUTO_AUTH":
                api = Vue.prototype.$api.autoHealthCheck;
                key = "healthCheck"
                break;
            case "TWO_EXCEPTION_ORDER_AUTO_DISPATCH":
                api = Vue.prototype.$api.autoErrorOrderLevelTwo;
                key = "errorOrderLevelTwo"
                break;
            case "CANCEL_ORDER_AUTO_AUTH":
                api = Vue.prototype.$api.autoRefuseOrder;
                key = "refuseOrder"
                break;
            default:
                break;
        }
        console.log(key, api, autoAuthIsOpen,
            authDuration,
            authStatus,
            extraContent)
        // Vue.prototype.$http.get(api, {}, true).then(res => {
        //     console.log("​getAutoStatus -> res", res);

        // }).catch(err => {
        //     console.log("​getAutoStatus -> err", err);

        // })
        // context.commit('saveState')
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}