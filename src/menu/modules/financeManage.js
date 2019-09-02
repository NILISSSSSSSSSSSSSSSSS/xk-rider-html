import { getPermission } from "./../../util/publicMehotds.js";
import { pTest } from "./../../util/publicParams";
export default {
    name: "财务管理",
    icon: "icon-finance",
    type: "notArea",
    items: [
        {
            icon: "icon-user",
            index: "withdrawMoney",
            title: "提现管理",
            subs: [
                //     {
                //     show: pTest || getPermission("riderCreate"),
                //     index: 'withdrawCheck',
                //     title: '提现审核(对接银行)'
                // },
                {
                    show:
                        pTest ||
                        getPermission("riderCreate") ||
                        getPermission("drawMoneyQPage"),
                    index: "manualWithdrawCheck",
                    title: "提现审核(线下转账)"
                }
                // {
                //     show: pTest || getPermission("riderCreate"),
                //     index: 'withdrawRecord',
                //     title: '提现记录'
                // }
            ]
        },
        {
            icon: "icon-user",
            index: "incomeManage",
            title: "财务对账",
            subs: [
                {
                    show:
                        pTest ||
                        getPermission("riderCreate") ||
                        getPermission("platformAccBillQPage"),
                    index: "incomeDetail",
                    title: "平台收入明细"
                },
                {
                    show:
                        pTest ||
                        getPermission("riderCreate") ||
                        getPermission("platformAccBillQPage"),
                    index: "outcomeDetail",
                    title: "平台支出明细"
                },
                {
                    show:
                        pTest ||
                        getPermission("riderCreate") ||
                        getPermission("platformAccBillQPage"),
                    index: "orderIncome",
                    title: "订单收益明细"
                }
                // , {
                //     show: pTest||getPermission("riderCreate"),
                //     index: "incomeDetailStatistics",
                //     title: "平台收入统计"
                // }
            ]
        },
        {
            icon: "icon-user",
            index: "accountCheck",
            title: "用户账户明细",
            subs: [
                {
                    show:
                        pTest ||
                        getPermission("riderCreate") ||
                        getPermission("riderAccQPage"),
                    index: "riderAccountList",
                    title: "骑士账户列表"
                }
                //     {
                //     show: pTest||getPermission("riderCreate"),
                //     index: 'merchantCheck',
                //     title: '商户对账'
                // }
                // , {
                //     show: pTest||getPermission("riderCreate"),
                //     index: 'selfMallCheck',
                //     title: '自营商城对账'
                // }
            ]
        }

        // {
        //     icon: "icon-user",
        //     index: "bankCardManage",
        //     title: "银行卡管理",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'bankCardList',
        //         title: '银行卡列表'
        //     }, {
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'openBankManage',
        //         title: '开户行管理'
        //     }]
        // },
        // {
        //     icon: "icon-user",
        //     index: "financeSetting",
        //     title: "财务设置",
        //     subs: [{
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'withdrawLimit',
        //         title: '提现额度设置'
        //     }, {
        //         show: pTest||getPermission("riderCreate"),
        //         index: 'feeSetting',
        //         title: '提现手续费设置'
        //     }]
        // }
    ]
};
