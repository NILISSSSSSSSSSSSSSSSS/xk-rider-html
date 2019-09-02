import {
    getPermission
} from "./../../util/publicMehotds.js";
import {
    pTest
} from "./../../util/publicParams"


let settingShow = pTest || getPermission("riderCreate") || getPermission("accessOrderSetting") || getPermission("transOrderSetting") || getPermission("exceptionOrderSetting") || getPermission("refuseOrderSetting") || getPermission("riderDistanceSetting") || getPermission("customerSetting");

let settingIndex =
    getPermission("riderCreate") ? "getOrderSetting" :
    getPermission("accessOrderSetting") ? "getOrderSetting" :
    getPermission("transOrderSetting") ? "transOrderSetting" :
    getPermission("exceptionOrderSetting") ? "errorDealSetting" :
    getPermission("refuseOrderSetting") ? "refuseSetting" :
    getPermission("riderDistanceSetting") ? "arriveSetting" : "serviceNumberSetting"
// getPermission("customerSetting") ?  : ""

export default {
    name: "平台管理",
    icon: "icon-platform",
    type: "notArea",
    items: [{
        icon: "icon-user",
        index: "financeSetting",
        title: "提现设置",
        subs: [{
            show: pTest || getPermission("riderCreate") || getPermission("drawMoneySetting"),
            index: 'withdrawLimit',
            title: '提现额度设置'
        }, {
            show: pTest || getPermission("riderCreate") || getPermission("poundageSetting"),
            index: 'feeSetting',
            title: '提现手续费设置'
        }]
    }, {
        icon: "icon-user",
        index: "platformWatch",
        title: "平台监管",
        subs: [{
            show: pTest || getPermission("riderCreate") || getPermission("opinionQPage"),
            index: 'feedback',
            title: '意见反馈'
        }]
    }, {
        icon: "icon-user",
        index: "pushManage",
        title: "推送内容管理",
        subs: [{
            show: pTest || getPermission("riderCreate") || getPermission("pushContentQPage"),
            index: 'pushDetailManage',
            title: '推送内容管理'
        }, {
            show: pTest || getPermission("riderCreate") || getPermission("pushContentCreate") || getPermission("pushContentUpdate"),
            // show: true,
            index: 'publish',
            title: "发布内容"
        }]
    }, {
        icon: "icon-user",
        index: "platform",
        title: "平台管理",
        subs: [{
            show: settingShow,
            index: settingIndex,
            title: '平台设置'
        }, {
            show: pTest || getPermission("riderCreate") || getPermission("bankQPage"),
            index: 'openBankManage',
            title: '开户行管理'
        }, {
            show: pTest || getPermission("riderCreate") || getPermission("protocolQPage"),
            index: 'agreementList',
            title: '平台协议设置'
        }]
    }, {
        icon: "icon-user",
        index: "transportChargeSetting",
        title: "平台配送费模板",
        subs: [{
            show: pTest || getPermission("riderCreate") || getPermission("carriageQPage"),
            index: 'transTemplate',
            title: '运费模版管理'
        }, {
            show: pTest || getPermission("riderCreate") || getPermission("carriageCreate") || getPermission("carriageUpdate"),
            index: 'newTemplate',
            title: '新建运费模版'
        }]
    }, {
        icon: "icon-user",
        index: "version",
        title: "客户端版本管理",
        subs: [{
            show: pTest || getPermission("riderCreate") || getPermission("definePage"),
            index: 'versionManage',
            title: '版本管理'
        }]
    }]
}