// import Vue from 'vue'
// import Router from 'vue-router'
import Login from "../views/login.vue";

// import Layout from "../views/layout.vue";
const Layout = () => import( /* webpackChunkName: "Layout" */ '../views/layout.vue');
const Welcome = () => import( /* webpackChunkName: "welcome" */ '../views/welcome.vue');
const Agreement = () => import( /* webpackChunkName: "Agreement" */ '../views/agreement.vue');
const Amap = () => import( /* webpackChunkName: "Amap" */ '../views/map.vue');

import user from "./modules/user"
import order from "./modules/order"
import platform from "./modules/platform"
import permission from "./modules/permission"
import finance from "./modules/finance"
import area from "./modules/area"

// Vue.use(Router)

export default new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'login', //登录
      component: Login
    },
    {
      path: '/',
      component: Layout, //布局容器
      children: [{
        path: '/welcome', //欢迎
        name: 'welcome',
        component: Welcome
      }]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/agreement', //协议展示
      name: 'agreement',
      component: Agreement,
    },
    {
      path: '/map', //协议展示
      name: 'map',
      component: Amap,
    },
    user, //用户管理
    order, //订单管理
    platform, //平台管理
    permission, //权限管理
    finance, //财务管理
    area //区域管理
  ]
})