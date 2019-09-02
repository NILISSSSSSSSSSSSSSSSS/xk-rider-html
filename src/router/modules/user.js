// import Layout from "../../views/layout.vue"
const Layout = () => import( /* webpackChunkName: "Layout" */ '../../views/layout.vue');
const riderList = () => import( /* webpackChunkName: "userlist" */ '../../views/user/userManage/riderList.vue');
// const platformUser = () => import( /* webpackChunkName: "platformUser" */ '../../views/user/platformUser');
const peoplePlatformCheck = () => import( /* webpackChunkName: "peoplePlatformCheck" */ '../../views/user/peoplePlatformCheck');
// const riderOrderList = () => import( /* webpackChunkName: "userlistrecord" */ '../../views/user/userManage/riderOrderList.vue')




export default {
    path: "/",
    component: Layout,
    children: [{
            path: "/riderList", //骑士列表
            name: 'riderList',
            component: riderList
        },
        // {
        //     path: "/platformUser", //平台用户列表
        //     name: 'platformUser',
        //     component: platformUser
        // }, 
        {
            path: "/peoplePlatformCheck", //认证审核,健康和身份
            name: 'peoplePlatformCheck',
            component: peoplePlatformCheck
        },
        // {
        //     path: '/riderOrderList', //骑士订单记录
        //     name: 'riderOrderList',
        //     component: riderOrderList
        // }
    ]
}