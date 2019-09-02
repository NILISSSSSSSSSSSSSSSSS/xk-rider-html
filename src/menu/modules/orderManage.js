import {
    getPermission
} from "./../../util/publicMehotds.js";
import {
    pTest
} from "./../../util/publicParams"
export default {
    name: "订单管理",
    icon: "icon-order",
    type: "notArea",
    items: [{
            show: pTest || getPermission("riderCreate") || getPermission("platformQPage") || getPermission("riderOrderQPage"),
            index: 'orderList',
            title: '订单列表',
            subs: []
        }, {
            show: pTest || getPermission("riderCreate") || getPermission("platformExceptionQPage"),
            index: 'wrongOrderList',
            title: '异常订单',
            subs: []
        }, {
            show: false,
            // show: pTest || getPermission("riderCreate") || getPermission("refuseOrderPage"),
            index: 'overtimeOrderList',
            title: '超时订单',
            subs: []
        }, {
            show: pTest || getPermission("riderCreate") || getPermission("refuseOrderPage"),
            index: 'refuseOrderCheck',
            title: '取消订单审核',
            subs: []
        }
        //     {
        //     icon: "icon-user",
        //     index: "order",
        //     title: "查看订单列表",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'orderList',
        //         title: '订单列表'
        //     }, {
        //         show: pTest||getPermission("riderCreate"),
        //         index: "errorOrderList",
        //         title: "异常订单列表"
        //     }]
        // }, {
        //     icon: "icon-user",
        //     index: "dealOrderManage",
        //     title: "订单处理管理",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: "dealOrder",
        //         title: "订单处理"
        //     }]
        // }
    ]
}