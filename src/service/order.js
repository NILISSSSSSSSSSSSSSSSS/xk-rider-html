import {
    baseUrl
} from "./../util/publicParams"
export default {
    // 订单
    orderGetList: baseUrl + 'riderManage/daweb/platformQPage/1.0',
    orderDetail: baseUrl + 'riderManage/daweb/orderDetail/1.0',
    // 异常订单
    orderErrorList: baseUrl + 'riderManage/daweb/platformExceptionQPage/1.0',
    orderErrorDeal: baseUrl + 'riderManage/daweb/dealOrder/1.0',
    orderErrorDetail: baseUrl + 'riderManage/daweb/exceptionOrderDetail/1.0',
    orderErrorDealNearByRider: baseUrl + 'riderManage/daweb/nearbyRider/1.0',
    // 取消订单
    orderRefuseList: baseUrl + 'riderManage/daweb/refuseOrderPage/1.0',
    orderRefuseDeal: baseUrl + 'riderManage/daweb/authRefuseOrder/1.0',
    orderRefuseDetail: baseUrl + 'riderManage/daweb/refuseReasonDetail/1.0',
    // 自动处理
    autoRefuseOrder: baseUrl + 'riderManage/daweb/cancelOrderAuthSetting/1.0',
    autoErrorOrderLevelTwo: baseUrl + 'riderManage/daweb/exceptionOrderAuthSetting/1.0',
}