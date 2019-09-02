import { baseUrl } from "./../util/publicParams";
export default {
    // 骑手
    financeRiderList: baseUrl + "riderManage/daweb/riderAccQPage/1.0",
    financeRiderDetail: baseUrl + "riderManage/daweb/riderAccBillQPage/1.0",
    // 平台
    financePlatformList: baseUrl + "riderManage/daweb/platformAccBillQPage/1.0",
    financeTradeDetail: baseUrl + "riderManage/daweb/platformAccBillDetail/1.0",
    //提现审核
    financeCheckList: baseUrl + "riderManage/daweb/drawMoneyQPage/1.0",
    financeCheckDetail: baseUrl + "riderManage/daweb/drawMoneyDetail/1.0",
    financeCheck: baseUrl + "riderManage/daweb/drawMoneyAuth/1.0",
    financeCheckConfirm: baseUrl + "riderManage/daweb/drawMoneyDrawConfirm/1.0",
    // 自动
    financeAutoCheck: baseUrl + "riderManage/daweb/drawMoneyAutoAuthSetting/1.0"
};
