import { getPermission } from "./../util/publicMehotds";
import {
    pTest //是否开启全部权限
} from "./../util/publicParams";
import { Message } from "element-ui";
// 功能模块权限

// 骑手列表
export const riderFrozen =
    pTest || getPermission("riderCreate") || getPermission("riderFrozen");
export const riderActive =
    pTest || getPermission("riderCreate") || getPermission("riderActive");
export const riderDetail =
    pTest || getPermission("riderCreate") || getPermission("riderDetail");

// 实名
export const checkIDList =
    pTest || getPermission("riderCreate") || getPermission("authQPage");
export const checkID =
    pTest || getPermission("riderCreate") || getPermission("idCardAuth");
export const autoCheckID =
    pTest || getPermission("riderCreate") || getPermission("idCardAuthSetting");
export const autoCheckIDDetail =
    pTest || getPermission("riderCreate") || getPermission("configDetail");
// 健康
export const checkHealthList =
    pTest || getPermission("riderCreate") || getPermission("healthAuth");
export const checkHealth =
    pTest || getPermission("riderCreate") || getPermission("healthAuthQPage");
export const autoCheckHealth =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("healthCardAuthSetting");
export const autoCheckHealthDetail =
    pTest || getPermission("riderCreate") || getPermission("configDetail");

// 订单
export const getOrderDetail =
    pTest || getPermission("riderCreate") || getPermission("orderDetail");

// 异常订单
export const getErrorOrderDetail =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("exceptionOrderDetail");
export const sendOrder =
    pTest || getPermission("riderCreate") || getPermission("nearbyRider");
export const dealOrder =
    pTest || getPermission("riderCreate") || getPermission("dealOrder");
export const autoDealOrder =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("exceptionOrderAuthSetting");
export const autoDealDetail =
    pTest || getPermission("riderCreate") || getPermission("configDetail");

// 取消订单
export const dealRefuseOrder =
    pTest || getPermission("riderCreate") || getPermission("authRefuseOrder");
export const refuseReasonDetail =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("refuseReasonDetail");
export const refuseOrderDetail =
    pTest || getPermission("riderCreate") || getPermission("refuseOrderDetail");
export const autoDealRefuseSetting =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("cancelOrderAuthSetting");
export const autoDealRefuseDetail =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("refuseReasonDetail");

//意见反馈
export const feedbackDelete =
    pTest || getPermission("riderCreate") || getPermission("opinionDelete");

// 推送内容
export const publish =
    pTest || getPermission("riderCreate") || getPermission("pushContentCreate");
export const pushContentUpdate =
    pTest || getPermission("riderCreate") || getPermission("pushContentUpdate");
export const pushContentDelete =
    pTest || getPermission("riderCreate") || getPermission("pushContentDelete");

// 平台设置
export const getOrderSetting =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("accessOrderSetting");
export const transOrderSetting =
    pTest || getPermission("riderCreate") || getPermission("transOrderSetting");
export const errorDealSetting =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("exceptionOrderSetting");
export const refuseSetting =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("refuseOrderSetting");
export const arriveSetting =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("riderDistanceSetting");
export const serviceNumberSetting =
    pTest || getPermission("riderCreate") || getPermission("customerSetting");

// 平台协议
export const agreementSetting =
    pTest || getPermission("riderCreate") || getPermission("protocolUpdate");

// 运费模版
export const templateNew =
    pTest || getPermission("riderCreate") || getPermission("carriageCreate");
export const templateDelete =
    pTest || getPermission("riderCreate") || getPermission("carriageDelete");
export const templateDetail =
    pTest || getPermission("riderCreate") || getPermission("carriageDetail");
export const templateUpdate =
    pTest || getPermission("riderCreate") || getPermission("carriageUpdate");

// 账号管理
export const accountUpdate =
    pTest || getPermission("riderCreate") || getPermission("userUpdate");
export const accountFrozen =
    pTest || getPermission("riderCreate") || getPermission("userFrozen");
export const accountActive =
    pTest || getPermission("riderCreate") || getPermission("userActive");
export const accountCreate =
    pTest || getPermission("riderCreate") || getPermission("userCreate");

// 角色管理
export const roleDelete =
    pTest || getPermission("riderCreate") || getPermission("roleDelete");
export const roleCreate =
    pTest || getPermission("riderCreate") || getPermission("roleCreate");
export const roleUpdate =
    pTest || getPermission("riderCreate") || getPermission("roleUpdate");

// 区域
export const createCaptain =
    pTest || getPermission("riderCreate") || getPermission("createCaptain");
export const updateCaptain =
    pTest || getPermission("riderCreate") || getPermission("updateCaptain");
export const deleteCaptain =
    pTest || getPermission("riderCreate") || getPermission("deleteCaptain");
export const frozenCaptain =
    pTest || getPermission("riderCreate") || getPermission("riderFrozen");
export const activeCaptain =
    pTest || getPermission("riderCreate") || getPermission("riderActive");
export const updateCaptainResource =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("updateCaptainResource");

//开户行
export const bankList =
    pTest || getPermission("riderCreate") || getPermission("bankQpage");
export const bankCreate =
    pTest || getPermission("riderCreate") || getPermission("bankCreate");
export const bankUpdate =
    pTest || getPermission("riderCreate") || getPermission("bankUpdate");
export const bankDelete =
    pTest || getPermission("riderCreate") || getPermission("bankDelete");

//主版本
export const versionList =
    pTest || getPermission("riderCreate") || getPermission("definePage");
export const versionCreate =
    pTest || getPermission("riderCreate") || getPermission("defineCreate");
export const versionUpdate =
    pTest || getPermission("riderCreate") || getPermission("defineUpdate");
export const versionDelete =
    pTest || getPermission("riderCreate") || getPermission("defineDelete");
//子版本
export const subversionList =
    pTest || getPermission("riderCreate") || getPermission("instancePage");
export const subversionCreate =
    pTest || getPermission("riderCreate") || getPermission("instanceCreate");
export const subversionUpdate =
    pTest || getPermission("riderCreate") || getPermission("instanceUpdate");
export const subversionDelete =
    pTest || getPermission("riderCreate") || getPermission("instanceDelete");
//提现
export const withdrawList =
    pTest || getPermission("riderCreate") || getPermission("drawMoneyQPage");
export const withdrawDetail =
    pTest || getPermission("riderCreate") || getPermission("drawMoneyDetail");
export const withdrawCheck =
    pTest || getPermission("riderCreate") || getPermission("drawMoneyAuth");
export const withdrawConfirm =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("drawMoneyDrawConfirm");
//平台账单明细
export const financePlatformList =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("platformAccBillQPage");
export const financePlatformOutList =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("platformAccBillQPage");
export const financePlatformOrderIncomeList =
    pTest ||
    getPermission("riderCreate") ||
    getPermission("platformAccBillQPage");
//骑手账户
export const riderFinanceList =
    pTest || getPermission("riderCreate") || getPermission("riderAccQPage");
export const riderFinanceDetail =
    pTest || getPermission("riderCreate") || getPermission("riderAccBillQPage");
//提现设置
export const financeWithdrawLimitSetting =
    pTest || getPermission("riderCreate") || getPermission("drawMoneySetting");
export const financeWithdrawFeeSetting =
    pTest || getPermission("riderCreate") || getPermission("poundageSetting");

const otherPermission = {
    financeWithdrawLimitSetting,
    financeWithdrawFeeSetting,

    withdrawList,
    withdrawDetail,
    withdrawCheck,
    withdrawConfirm,

    financePlatformList,
    financePlatformOutList,
    financePlatformOrderIncomeList,

    riderFinanceList,
    riderFinanceDetail,

    riderFrozen,
    riderActive,
    riderDetail,

    checkIDList,
    checkID,
    autoCheckID,
    autoCheckIDDetail,

    checkHealthList,
    checkHealth,
    autoCheckHealth,
    autoCheckHealthDetail,

    getOrderDetail,

    getErrorOrderDetail,
    sendOrder,
    dealOrder,
    autoDealOrder,
    autoDealDetail,

    dealRefuseOrder,
    refuseReasonDetail,
    refuseOrderDetail,
    autoDealRefuseSetting,
    autoDealRefuseDetail,

    feedbackDelete,

    pushContentUpdate,
    pushContentDelete,
    publish,

    getOrderSetting,
    transOrderSetting,
    errorDealSetting,
    refuseSetting,
    arriveSetting,
    serviceNumberSetting,

    agreementSetting,

    templateNew,
    templateDelete,
    templateDetail,
    templateUpdate,

    accountUpdate,
    accountFrozen,
    accountActive,
    accountCreate,

    roleDelete,
    roleCreate,
    roleUpdate,

    createCaptain,
    updateCaptain,
    deleteCaptain,
    frozenCaptain,
    activeCaptain,
    updateCaptainResource,

    bankList,
    bankCreate,
    bankDelete,
    bankUpdate,

    versionList,
    versionCreate,
    versionUpdate,
    versionDelete,

    subversionList,
    subversionCreate,
    subversionUpdate,
    subversionDelete
};
export const canUse = key => {
    if (!otherPermission[key]) {
        Message.error("你的权限不足，请联系管理员");
    }
    return otherPermission[key];
};
