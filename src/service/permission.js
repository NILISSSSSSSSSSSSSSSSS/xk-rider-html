import {
    baseUrl
} from "./../util/publicParams"
export default {
    // 角色管理
    permissionResourceList: baseUrl + 'riderManage/daweb/resourcePage/1.0',
    permissionRoleList: baseUrl + 'riderManage/daweb/rolePage/1.0',
    permissionCreateRole: baseUrl + 'riderManage/daweb/roleCreate/1.0',
    permissionDeleteRole: baseUrl + 'riderManage/daweb/roleDelete/1.0',
    permissionRoleDetail: baseUrl + 'riderManage/daweb/roleDetail/1.0',
    permissionUpdateRole: baseUrl + 'riderManage/daweb/roleUpdate/1.0',
    // 账号管理
    permissionAccountList: baseUrl + 'riderManage/daweb/userQPage/1.0',
    permissionAccountCreate: baseUrl + 'riderManage/daweb/userCreate/1.0',
    permissionAccountModify: baseUrl + 'riderManage/daweb/userUpdate/1.0',
    permissionAccountFrozen: baseUrl + 'riderManage/daweb/userFrozen/1.0',
    permissionAccountActive: baseUrl + 'riderManage/daweb/userActive/1.0',
    //日志
    permissionLog: baseUrl + 'riderManage/daweb/userLogQPage/1.0',
}