// import Layout from "../../views/layout.vue"
const Layout = () => import( /* webpackChunkName: "Layout" */ '../../views/layout.vue');
const log = () => import( /* webpackChunkName: "log" */ '../../views/permission/logManage');
const accountSetting = () => import( /* webpackChunkName: "accountSetting" */ '../../views/permission/accountSetting');
const roleManage = () => import( /* webpackChunkName: "roleManage" */ '../../views/permission/roleManage');





export default {
    path: "/",
    component: Layout,
    children: [{
        path: "/log", //操作员管理日志
        name: 'log',
        component: log
    }, {
        path: "/accountSetting", //账户设置
        name: 'accountSetting',
        component: accountSetting
    }, {
        path: "/roleManage", //角色管理
        name: 'roleManage',
        component: roleManage
    }]
}