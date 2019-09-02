// import Vue from 'vue'
// import Vuex from 'vuex'

// 分页
import pagination from "./modules/pagination"
//平台设置详情
// import platformSetting from "./modules/platform/platformSetting"
// 保存协议
import agreement from "./modules/platform/agreement"
// 推送
import publish from "./modules/platform/publish"
//自动处理
// import auto from "./modules/autoDeal/index"
//运费模版
import template from "./modules/platform/template"
// Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        pagination,
        // platformSetting,
        agreement,
        publish,
        template,
        // auto
    }
})