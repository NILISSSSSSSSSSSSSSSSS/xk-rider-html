// import Layout from "../../views/layout.vue"
const Layout = () => import( /* webpackChunkName: "Layout" */ '../../views/layout.vue');
const orderList = () => import( /* webpackChunkName: "orderlist" */ '../../views/order/orderList');
const overtimeOrderList = () => import( /* webpackChunkName: "overtimeOrderList" */ '../../views/order/overtimeOrderList');
const wrongOrderList = () => import( /* webpackChunkName: "wrongOrderList" */ '../../views/order/wrongOrderList')
const wrongDetail = () => import( /* webpackChunkName: "wrongDetail" */ '../../views/order/wrongOrderList/wrongDetail.vue')
const sendOrder = () => import( /* webpackChunkName: "sendOrder" */ '../../views/order/wrongOrderList/sendOrder.vue')
const refuseOrderCheck = () => import( /* webpackChunkName: "refuseOrderCheck" */ '../../views/order/refuseOrderCheck')
const refuseOrderDetail = () => import( /* webpackChunkName: "refuseOrderDetail" */ '../../views/order/refuseOrderCheck/refuseOrderDetail.vue')
const orderDetail = () => import( /* webpackChunkName: "orderdetail" */ '../../views/order/orderList/orderDetail.vue')




export default {
    path: "/",
    component: Layout,
    children: [{
        path: "/orderList", //订单列表
        name: 'orderList',
        component: orderList
    },{
        path: "/overtimeOrderList", //订单列表
        name: 'overtimeOrderList',
        component: overtimeOrderList
    }, {
        path: "/wrongOrderList", //异常列表
        name: 'wrongOrderList',
        component: wrongOrderList
    }, {
        path: "/refuseOrderCheck", //拒单审核
        name: 'refuseOrderCheck',
        component: refuseOrderCheck
    }, {
        path: "/orderDetail", //订单详情
        name: 'orderDetail',
        component: orderDetail
    }, {
        path: '/wrongDetail', //异常订单详情
        name: 'wrongDetail',
        component: wrongDetail
    }, {
        path: '/sendOrder', //异常订单派单
        name: 'sendOrder',
        component: sendOrder
    }, {
        path: '/refuseOrderDetail', //拒单详情
        name: 'refuseOrderDetail',
        component: refuseOrderDetail
    }]
}