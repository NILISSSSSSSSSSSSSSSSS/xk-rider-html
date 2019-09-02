// import Vue from 'vue'
//promise 兼容处理
import "babel-polyfill";
// import '@babel/polyfill'
//进度条
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// import { amapKey } from "./util/publicParams";
// // 高德地图;
// import VueAMap from "vue-amap";
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//     key: amapKey,
//     plugin: ["AMap.Geolocation", "AMap.Scale", "AMap.ToolBar"],
//     // 默认高德 sdk 版本为 1.4.4
//     v: "1.4.4"
// });

import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import axios, { getTemp } from "./axios/index";
import { getSession, loginOut } from "./util/publicMehotds";
getTemp();
import service from "./service/index";
import "./util/filters";
// import "./util/directives";

// import elementUI from 'element-ui'
// Vue.use(elementUI);

// import "element-ui/lib/theme-chalk/index.css";
/**
 * element 自定义主题
 */
import "./assets/sass/element-variables.scss";
/**
 * element 公共样式
 */
import "./assets/sass/index.scss";

/**
 * 字体图标
 */
import "./icomoon/style.css";

// 公共组件
import {
    Message
    // MessageBox
} from "element-ui";
import Pagination from "./components/all/Pagination.vue";
import viewImage from "./components/all/viewImage/ViewImage";
Vue.component("Pagination", Pagination);
import { errorHandler } from "./util/error";
Vue.config.errorHandler = errorHandler;

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$api = service;
Vue.prototype.$size = "small";
Vue.prototype.$viewImage = viewImage;
Vue.prototype.$throw = error => errorHandler(error, this);

router.beforeEach((to, from, next) => {
    NProgress.start();
    let user = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {};
    if (to.path == "/agreement") {
        next();
    }
    // else if (to.path == "/map") {
    //     next();
    // }
    else if (to.path !== "/login") {
        if (user.token) {
            if (to.path == "/map") {
                next();
            } else {
                // if (to.path !== "/welcome") {
                let arr = to.path.split("/");
                let map = getSession("permission")
                    ? JSON.parse(getSession("permission"))
                    : {};
                if (!map[`${arr[1]}`]) {
                    Message.error("你的权限不足，请联系管理员");
                    if (user.role[0].roleType == "SYSTEM") {
                        next("/areaHomePage");
                    } else {
                        next("/welcome");
                    }
                    NProgress.done();
                } else {
                    next();
                }
            }
        } else {
            //防止浏览器回退按钮
            window.history.forward(1);
            next("/login");
        }
    } else {
        if (from.path != "/") {
            loginOut();
            next("/login");
        } else {
            next();
        }
    }
});
router.afterEach(() => {
    NProgress.done();
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
