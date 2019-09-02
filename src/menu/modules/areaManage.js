import {
    getPermission
} from "../../util/publicMehotds.js";
import {
    pTest
} from "./../../util/publicParams"
export default {
    name: "区域管理",
    icon: "icon-operation",
    type: "area",
    items: [{
            icon: "icon-user",
            index: "areaHomePage",
            show: true,
            // show: pTest || getPermission("riderCreate")||getPermission("partnerHomePage"),
            title: "区域首页",
            subs: []
        }, {
            icon: "icon-user",
            index: "areaRiderList",
            show: pTest || getPermission("riderCreate") || getPermission("partnerRiderQPage"),
            title: "骑士列表",
            subs: []
        }, {
            icon: "icon-user",
            index: "groupLeaderManage",
            show: pTest || getPermission("riderCreate") || getPermission("captainQPage"),
            title: "组长管理",
            subs: []
        }, {
            icon: "icon-user",
            index: "areaCharts",
            show: false,
            title: "数据统计",
            subs: []
        },
        // {
        //     icon: "icon-user",
        //     index: "areaManage",
        //     title: "区域管理",
        //     subs: [
        //         {
        //         show: pTest||getPermission("riderCreate"),
        //         index: "groupLeaderSetting",
        //         title: "设置组长"
        //     }, {
        //         show: pTest||getPermission("riderCreate"),
        //         index: "MerchantManage",
        //         title: "商户管理"
        //     }, {
        //         show: pTest||getPermission("riderCreate"),
        //         index: "infoCheck",
        //         title: "信息审核"
        //     }, {
        //         show: pTest||getPermission("riderCreate"),
        //         index: "areaOrder",
        //         title: "订单管理"
        //     }]
        // }, {
        //     icon: "icon-user",
        //     index: "platformWatch",
        //     title: "平台监管",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'feedback',
        //         title: '意见反馈'
        //     }]
        // }, {
        //     icon: "icon-user",
        //     index: "pushManage",
        //     title: "推送管理",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'pushDetailManage',
        //         title: '推送内容管理'
        //     }]
        // }, 
        // {
        //     icon: "icon-user",
        //     index: "adManage",
        //     title: "广告管理",
        //     subs: [{
        //         show: false,
        //         index: 'addAD',
        //         title: '添加广告位'
        //     }]
        // }, {
        //     icon: 'icon-user',
        //     index: "areaManage",
        //     title: "区域管理",
        //     subs: [{
        //             show: pTest||getPermission("riderCreate"),
        //             index: "groupLeaderManage",
        //             title: "组长管理"
        //         }, {
        //             show: pTest||getPermission("riderCreate"),
        //             index: "MerchantManage",
        //             title: "商户管理"
        //         }
        // ,{
        //     show: pTest||getPermission("riderCreate"),
        //     index: "peopleAreaCheck",
        //     title: "实名认证审核"
        // },{
        //     show: pTest||getPermission("riderCreate"),
        //     index: "healthAreaCheck",
        //     title: "用户健康证审核"
        // }
        //     ]
        // }
        // , {
        //     icon: "icon-user",
        //     index: "platform",
        //     title: "平台",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'platformSetting',
        //         title: '平台设置'
        //     }, {
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'agreementSetting',
        //         title: '平台协议设置'
        //     }]
        // }, {
        //     icon: "icon-user",
        //     index: "transportChargeSetting",
        //     title: "平台配送费模板",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'transportChargetTemplate',
        //         title: '运费模版管理'
        //     }, {
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'transportChargeNew',
        //         title: '新建运费模版'
        //     }]
        // }
    ]
}