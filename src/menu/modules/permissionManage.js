import {
    getPermission
} from "./../../util/publicMehotds.js";
import {
    pTest
} from "./../../util/publicParams"
export default {
    name: "权限管理",
    icon: "icon-permission",
    type: "notArea",
    items: [{
            icon: "icon-user",
            index: "log",
            show: pTest || getPermission("riderCreate") || getPermission("userLogQPage"),
            title: '管理员操作日志',
            subs: []
        }, {
            icon: "icon-user",
            index: "accountSetting",
            show: pTest || getPermission("riderCreate") || getPermission("userQPage"),
            title: "账号管理",
            subs: [
                //     {
                //     show: pTest||getPermission("riderCreate"),
                //     index: 'permissionAssign',
                //     title: '权限分配'
                // }, {
                //     show: pTest||getPermission("riderCreate"),
                //     index: "roleManage",
                //     title: "角色设置"
                // }
            ]
        }, {
            icon: "icon-user",
            show: pTest || getPermission("riderCreate") || (getPermission("resourcePage") && getPermission("rolePage")),
            index: "roleManage",
            title: "角色管理",
            subs: []
        }
        // , {
        //     icon: "icon-user",
        //     index: "role",
        //     title: "角色组管理",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'roleManage',
        //         title: '角色组管理'
        //     }]
        // }
    ]
}