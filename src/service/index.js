// const baseUrl = "/api/";
import {
    baseUrl
} from "./../util/publicParams"
// const riderBaseUrl = "/manager/";
import order from "./order";
import user from "./user";
import permission from "./permission";
import platform from "./platform";
import operation from "./operation";
import finance from "./finance"
export default {
    ...user,
    ...order,
    ...permission,
    ...platform,
    ...operation,
    ...finance,
    timestamp: baseUrl + "sys/daweb/systemTime/1.0",
    qiniu_token: baseUrl + "sys/daweb/qosstoken/1.0",
    login: baseUrl + "user/daweb/dUserLoginByPwd/1.0",
    welcome: baseUrl + "riderManage/daweb/adminHomePage/1.0",
    uploadLocation: baseUrl + "riderManage/daweb/warehouseConfig/1.0",
    agreementDetail: baseUrl + "riderApp/daweb/protocolDetail/1.0",
    /*
        查询所有省份：level=1
        查询所有城市：level=2
        查询所有区/县：level=3
        查询热门城市：level=2&isHot=1
        查询四川的所有城市：parentCode=510000
        查询成都：keyword=成都 || keyword=chengdu || keyword=cd
        */
    regionPage: baseUrl + 'sys/om/regionPage/1.0'




}