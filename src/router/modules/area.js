// import Layout from "../../views/layout.vue"
const Layout = () => import( /* webpackChunkName: "Layout" */ '../../views/layout.vue');
const groupLeaderManage = () => import( /* webpackChunkName: "groupLeaderManage" */ '../../views/operation/areaManage/groupLeaderManage.vue');
const areaRiderList = () => import( /* webpackChunkName: "areaRiderList" */ '../../views/operation/areaManage/areaRiderList.vue');
// const merchantManage = () => import( /* webpackChunkName: "merchantManage" */ '../../views/operation/areaManage/merchantManage.vue');
const areaHomePage = () => import( /* webpackChunkName: "areaHomePage" */ '../../views/operation/areaWelcome.vue')




export default {
    path: "/",
    component: Layout,
    children: [{
            path: "/groupLeaderManage", //组长管理
            name: 'groupLeaderManage',
            component: groupLeaderManage
        }, {
            path: "/areaHomePage", //区域欢迎
            name: 'areaHomePage',
            component: areaHomePage
        }, {
            path: "/areaRiderList", //区域骑士列表
            name: 'areaRiderList',
            component: areaRiderList
        },
        //  {
        //     path: "/merchantManage", //商户管理
        //     name: 'merchantManage',
        //     component: merchantManage
        // }
    ]
}