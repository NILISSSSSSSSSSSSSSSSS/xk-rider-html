import {
    getPermission
} from "./../../util/publicMehotds.js";
import {
    pTest
} from "./../../util/publicParams"
export default {
    name: "用户管理",
    icon: "icon-icon30",
    type: "notArea",
    items: [{
            icon: "icon-user",
            index: "riderList",
            title: '骑士列表',
            show: pTest||getPermission("riderCreate")||getPermission("riderQPage"),
            subs: []
        },
        //  {
        //     icon: "icon-user",
        //     index: "platformUser",
        //     title: '平台用户列表',
        //     show: pTest||getPermission("riderCreate"),
        //     subs: []
        // },
        {
            icon: "icon-user",
            index: "peoplePlatformCheck",
            title: '认证审核',
            show: pTest||getPermission("riderCreate")||getPermission("authQPage")||getPermission("healthAuth"),
            subs: []
        }
        // {
        //     icon: "icon-user",
        //     index: "user",
        //     title: "用户",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'userList',
        //         title: '用户列表'
        //     }]
        // },

        // {
        //     icon: "icon-user",
        //     index: "peopleCheck",
        //     title: "实名认证审核",
        //     subs: [

        //         {
        //             show: pTest||getPermission("riderCreate"),
        //             index: 'peoplePlatformCheck',
        //             title: '平台审核'
        //         }
        //     ]
        // }, {
        //     icon: "icon-user",
        //     index: "healthCheck",
        //     title: "健康证审核",
        //     subs: [

        //         {
        //             show: pTest||getPermission("riderCreate"),
        //             index: 'healthPlatformCheck',
        //             title: '平台审核'
        //         }
        //     ]
        // }
    ]
}