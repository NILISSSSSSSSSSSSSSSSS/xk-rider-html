import {
    getPermission
} from "./../util/publicMehotds";
import {
    pTest //是否开启全部权限
} from "./../util/publicParams";
import finance from "./modules/financeManage";
import order from "./modules/orderManage";
import user from "./modules/userManage";
import permission from "./modules/permissionManage";
import area from "./modules/areaManage";
import platform from "./modules/platformManage";
// import Vue from "vue";
export default {
    user,
    order,
    area,
    finance,
    platform,
    permission
};

// 不在menu中的页面
export const otherMenu = {
    agreement: true,
    login: true,
    welcome: true,
    // userlistrecord: pTest, //用户列表记录
    // userDetail: pTest, //用户详情
    wrongDetail: pTest || getPermission("riderCreate") || getPermission("exceptionOrderDetail"), //异常订单详情
    sendOrder: pTest || getPermission("riderCreate") || getPermission("nearbyRider"), //派单
    orderDetail: pTest || getPermission("riderCreate") || getPermission("orderDetail"),
    refuseOrderDetail: pTest || getPermission("riderCreate") || getPermission("refuseOrderDetail"), //拒单审核详情
    //平台设置
    getOrderSetting: pTest || getPermission("riderCreate") || getPermission("accessOrderSetting"),
    transOrderSetting: pTest || getPermission("riderCreate") || getPermission("transOrderSetting"),
    errorDealSetting: pTest || getPermission("riderCreate") || getPermission("exceptionOrderSetting"),
    refuseSetting: pTest || getPermission("riderCreate") || getPermission("refuseOrderSetting"),
    arriveSetting: pTest || getPermission("riderCreate") || getPermission("riderDistanceSetting"),
    serviceNumberSetting: pTest || getPermission("riderCreate") || getPermission("customerSetting"),
    //编辑协议
    agreementSetting: pTest || getPermission("riderCreate") || getPermission("protocolUpdate"),

    // 版本
    subVersion: pTest || getPermission("riderCreate") || getPermission("instancePage"),

    // 财务
    riderIncomeCheck: pTest || getPermission("riderCreate") || getPermission("riderAccBillQPage"),
}