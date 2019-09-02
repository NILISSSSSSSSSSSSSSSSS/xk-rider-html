// import Layout from "../../views/layout.vue"
const Layout = () =>
    import(/* webpackChunkName: "Layout" */ "../../views/layout.vue");
// const withdrawCheck = () => import( /* webpackChunkName: "withdrawCheck" */ '../../views/finance/withdrawManage/withdrawCheck.vue');
const manualWithdrawCheck = () =>
    import(
        /* webpackChunkName: "manualWithdrawCheck" */ "../../views/finance/withdrawManage/manualWithdrawCheck.vue"
    );
// const withdrawRecord = () => import( /* webpackChunkName: "withdrawRecord" */ '../../views/finance/withdrawManage/withdrawRecord.vue');
const riderIncomeCheck = () =>
    import(
        /* webpackChunkName: "riderIncomeCheck" */ "../../views/finance/accountCheck/riderIncomeCheck.vue"
    );
const riderAccountList = () =>
    import(
        /* webpackChunkName: "riderAccountList" */ "../../views/finance/accountCheck/riderAccountList.vue"
    );
// const merchantCheck = () => import( /* webpackChunkName: "merchantCheck" */ '../../views/finance/accountCheck/merchantCheck.vue');
// const selfMallCheck = () => import( /* webpackChunkName: "selfMallCheck" */ '../../views/finance/accountCheck/selfMallCheck.vue');
const incomeDetail = () =>
    import(
        /* webpackChunkName: "incomeDetail" */ "../../views/finance/income/incomeDetail.vue"
    );
const outcomeDetail = () =>
    import(
        /* webpackChunkName: "outcomeDetail" */ "../../views/finance/income/outcomeDetail.vue"
    );
const orderIncome = () =>
    import(
        /* webpackChunkName: "orderIncome" */ "../../views/finance/income/orderIncome.vue"
    );

export default {
    path: "/",
    component: Layout,
    children: [
        // {
        //     path: "/withdrawCheck", //提现审核 银行
        //     name: 'withdrawCheck',
        //     component: withdrawCheck
        // },
        {
            path: "/manualWithdrawCheck", //提现审核 人工
            name: "manualWithdrawCheck",
            component: manualWithdrawCheck
        },
        // {
        //     path: "/withdrawRecord", //提现记录
        //     name: 'withdrawRecord',
        //     component: withdrawRecord
        // },
        // {
        //     path: "/merchantCheck", //商户对账
        //     name: 'merchantCheck',
        //     component: merchantCheck
        // },
        {
            path: "/riderIncomeCheck", //骑士账户明细
            name: "riderIncomeCheck",
            component: riderIncomeCheck
        },
        {
            path: "/riderAccountList", //骑士账户列表
            name: "riderAccountList",
            component: riderAccountList
        },
        //  {
        //     path: "/selfMallCheck", //自营商城对账
        //     name: 'selfMallCheck',
        //     component: selfMallCheck
        // },
        {
            path: "/incomeDetail", //收入明细
            name: "incomeDetail",
            component: incomeDetail
        },
        {
            path: "/outcomeDetail", //支出明细
            name: "outcomeDetail",
            component: outcomeDetail
        },
        {
            path: "/orderIncome", //订单收益明细
            name: "orderIncome",
            component: orderIncome
        }
    ]
};
