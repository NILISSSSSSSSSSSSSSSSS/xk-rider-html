import {
    baseUrl
} from "./../util/publicParams"
export default {
    // 平台设置
    platformConfigDetail: baseUrl + 'riderManage/daweb/configDetail/1.0',
    platformGetOrderSetting: baseUrl + 'riderManage/daweb/accessOrderSetting/1.0',
    platformTransOrderSetting: baseUrl + 'riderManage/daweb/transOrderSetting/1.0',
    platformErrorOrderSetting: baseUrl + 'riderManage/daweb/exceptionOrderSetting/1.0',
    platformRefuseOrderSetting: baseUrl + 'riderManage/daweb/refuseOrderSetting/1.0',
    platformArriveSetting: baseUrl + 'riderManage/daweb/riderDistanceSetting/1.0',
    platformServiceNumberSetting: baseUrl + 'riderManage/daweb/customerSetting/1.0',
    // 推送
    platformPublish: baseUrl + 'riderManage/daweb/pushContentCreate/1.0',
    platformPublishUpdate: baseUrl + 'riderManage/daweb/pushContentUpdate/1.0',
    platformPublishDelete: baseUrl + 'riderManage/daweb/pushContentDelete/1.0',
    platformPublishList: baseUrl + 'riderManage/daweb/pushContentQPage/1.0',
    // 运费模版
    platformTemplateCreate: baseUrl + 'riderManage/daweb/carriageCreate/1.0',
    platformTemplateUpdate: baseUrl + 'riderManage/daweb/carriageUpdate/1.0',
    platformTemplateList: baseUrl + 'riderManage/daweb/carriageQPage/1.0',
    platformTemplateDetail: baseUrl + 'riderManage/daweb/carriageDetail/1.0',
    platformTemplateDelete: baseUrl + 'riderManage/daweb/carriageDelete/1.0',
    // 意见反馈
    platformFeedbackList: baseUrl + 'riderManage/daweb/opinionQPage/1.0',
    platformFeedbackDelete: baseUrl + 'riderManage/daweb/opinionDelete/1.0',
    // 平台协议
    platformAgreementList: baseUrl + 'riderManage/daweb/protocolQPage/1.0',
    platformAgreementSetting: baseUrl + 'riderManage/daweb/protocolUpdate/1.0',
    // 开户行
    platformBankList: baseUrl + 'riderManage/daweb/bankQPage/1.0',
    platformBankCreate: baseUrl + 'riderManage/daweb/bankCreate/1.0',
    platformBankUpdate: baseUrl + 'riderManage/daweb/bankUpdate/1.0',
    platformBankDelete: baseUrl + 'riderManage/daweb/bankDelete/1.0',
    // 版本管理
    platformVersionList: baseUrl + 'riderManage/daweb/definePage/1.0',
    platformVersionAdd: baseUrl + 'riderManage/daweb/defineCreate/1.0',
    platformVersionDelete: baseUrl + 'riderManage/daweb/defineDelete/1.0',
    platformVersionDetail: baseUrl + 'riderManage/daweb/defineDetail/1.0',
    platformVersionUpdate: baseUrl + 'riderManage/daweb/defineUpdate/1.0',
    // 子版本
    platformSubVersionAdd: baseUrl + 'riderManage/daweb/instanceCreate/1.0',
    platformSubVersionList: baseUrl + 'riderManage/daweb/instancePage/1.0',
    platformSubVersionDelete: baseUrl + 'riderManage/daweb/instanceDelete/1.0',
    platformSubVersionUpdate: baseUrl + 'riderManage/daweb/instanceUpdate/1.0',
    //提现
    platformWithdrawLimit: baseUrl + "riderManage/daweb/drawMoneySetting/1.0",
    platformFeeSetting: baseUrl + "riderManage/daweb/poundageSetting/1.0"
}