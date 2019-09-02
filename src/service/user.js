import {
    baseUrl
} from "./../util/publicParams"
export default {
    // 骑手列表
    userRiderList: baseUrl + 'riderManage/daweb/riderQPage/1.0',
    userRiderDetail: baseUrl + 'riderManage/daweb/riderDetail/1.0',
    userRiderFrozen: baseUrl + 'riderManage/daweb/riderFrozen/1.0',
    userRiderActive: baseUrl + 'riderManage/daweb/riderActive/1.0',
    userRiderOrderList: baseUrl + 'riderManage/daweb/riderOrderQPage/1.0',
    userGetAreaLeaders: baseUrl + 'riderManage/daweb/partnerQList/1.0',
    // 认证
    checkIDlist: baseUrl + 'riderManage/daweb/authQPage/1.0',
    checkID: baseUrl + 'riderManage/daweb/idCardAuth/1.0',
    checkHealthList: baseUrl + 'riderManage/daweb/healthAuthQPage/1.0',
    checkHealth: baseUrl + 'riderManage/daweb/healthAuth/1.0',
    checkHealthDetail: baseUrl + 'riderManage/daweb/healthDetail/1.0',
    //自动处理
    autoIDcheck: baseUrl + 'riderManage/daweb/idCardAuthSetting/1.0',
    autoHealthCheck: baseUrl + 'riderManage/daweb/healthCardAuthSetting/1.0',
}