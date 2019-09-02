import {
    baseUrl
} from "./../util/publicParams"
export default {
    operationGetGroupLeaderList: baseUrl + 'riderManage/daweb/captainQPage/1.0',
    operationAddGroupLeader: baseUrl + 'riderManage/daweb/createCaptain/1.0',
    operationFreezeLeader: baseUrl + 'riderManage/daweb/riderFrozen/1.0',
    operationActiveLeader: baseUrl + 'riderManage/daweb/riderActive/1.0',
    operationAreaWelcome: baseUrl + 'riderManage/daweb/partnerHomePage/1.0',
    operationGroupLeaderDelete: baseUrl + 'riderManage/daweb/deleteCaptain/1.0',

    operationAreaRider: baseUrl + 'riderManage/daweb/partnerRiderQPage/1.0',
    operationAreaMerchantRider: baseUrl + 'riderManage/daweb/partnerMerchantRiderQPage/1.0',

    operationSetGroupPermission: baseUrl + 'riderManage/daweb/updateCaptainResource/1.0',

    operationSetServicePhone:baseUrl + 'riderManage/daweb/partnerContactPhone/1.0',
    operationGetServicePhone:baseUrl + 'riderManage/daweb/partnerContactPhoneDetail/1.0',
}