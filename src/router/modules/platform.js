// import Layout from "../../views/layout.vue"
const Layout = () => import( /* webpackChunkName: "Layout" */ '../../views/layout.vue');
const withdrawLimit = () => import( /* webpackChunkName: "withdrawLimit" */ '../../views/platform/finance/withdrawLimit');
const feeSetting = () => import( /* webpackChunkName: "withdrawLimit" */ '../../views/platform/finance/feeSetting');
const feedback = () => import( /* webpackChunkName: "feedback" */ '../../views/platform/platformWatch/feedback');
// const feedbackDetail = () => import( /* webpackChunkName: "feedbackDetail" */ '../../views/platform/platformWatch/feedback/detail.vue');
const publish = () => import( /* webpackChunkName: "publish" */ '../../views/platform/pushManage/publish/publish.vue');
const pushDetailManage = () => import( /* webpackChunkName: "pushDetailManage" */ "../../views/platform/pushManage/publish/pushDetailManage.vue")
// const addUserGroup = () => import( /* webpackChunkName: "addUserGroup" */ '../../views/platform/pushManage/publish/addUserGroup.vue')
// const userGroupList = () => import( /* webpackChunkName: "userGroupList"*/ '../../views/platform/pushManage/userGroupList');
// const chooseGroupUser = () => import( /* webpackChunkName: "chooseGroupUser"*/ '../../views/platform/pushManage/userGroupList/chooseGroupUser.vue');
const platformSetting = () => import( /* webpackChunkName: "platformSetting"*/ '../../views/platform/platformSetting/platformSetting.vue');
const getOrderSetting = () => import( /* webpackChunkName: "getOrderSetting"*/ '../../views/platform/platformSetting/getOrderSetting.vue');
const transOrderSetting = () => import( /* webpackChunkName: "transOrderSetting"*/ '../../views/platform/platformSetting/transOrderSetting.vue');
const errorDealSetting = () => import( /* webpackChunkName: "errorDealSetting"*/ '../../views/platform/platformSetting/errorDealSetting.vue');
const refuseSetting = () => import( /* webpackChunkName: "refuseSetting"*/ '../../views/platform/platformSetting/refuseSetting.vue');
const arriveSetting = () => import( /* webpackChunkName: "arriveSetting"*/ '../../views/platform/platformSetting/arriveSetting.vue');
const serviceNumberSetting = () => import( /* webpackChunkName: "serviceNumberSetting"*/ '../../views/platform/platformSetting/serviceNumberSetting.vue');
const openBankManage = () => import( /* webpackChunkName: "openBankManage"*/ '../../views/platform/platformSetting/openBankManage.vue');
const agreementSetting = () => import( /* webpackChunkName: "agreementSetting"*/ '../../views/platform/platformSetting/agreementSetting.vue');
const agreementList = () => import( /* webpackChunkName: "agreementList"*/ '../../views/platform/platformSetting/agreementList.vue');
const transTemplate = () => import( /* webpackChunkName: "feeTemplate"*/ '../../views/platform/feeTemplate/transTemplate.vue');
const newTemplate = () => import( /* webpackChunkName: "newTemplate"*/ '../../views/platform/feeTemplate/newTemplate.vue');
const versionManage = () => import( /* webpackChunkName: "versionManage"*/ '../../views/platform/versionManage');
const subVersion = () => import( /* webpackChunkName: "subVersion"*/ '../../views/platform/versionManage/subVersion.vue');




export default {
    path: "/",
    component: Layout,
    children: [{
            path: "/withdrawLimit", //提现额度
            name: 'withdrawLimit',
            component: withdrawLimit
        }, {
            path: "/feeSetting", //提现手续费
            name: 'feeSetting',
            component: feeSetting
        }, {
            path: "/feedback", //意见反馈
            name: 'feedback',
            component: feedback
        }, {
            path: "/publish", //发布内容 推送
            name: 'publish',
            component: publish
        },
        // {
        //     path: "/feedbackDetail", //意见反馈详情
        //     name: 'feedbackDetail',
        //     component: feedbackDetail
        // },
        {
            path: "/pushDetailManage", //推送管理
            name: 'pushDetailManage',
            component: pushDetailManage
        }, {
            path: "/", //平台设置
            component: platformSetting,
            children: [{
                path: "/getOrderSetting", //平台设置
                name: 'getOrderSetting',
                component: getOrderSetting
            }, {
                path: "/transOrderSetting", //转单设置
                name: 'transOrderSetting',
                component: transOrderSetting
            }, {
                path: "/errorDealSetting", //异常处理设置
                name: 'errorDealSetting',
                component: errorDealSetting
            }, {
                path: "/refuseSetting", //拒单设置
                name: 'refuseSetting',
                component: refuseSetting
            }, {
                path: "/arriveSetting", //送达设置
                name: 'arriveSetting',
                component: arriveSetting
            }, {
                path: "/serviceNumberSetting", //服务号码设置
                name: 'serviceNumberSetting',
                component: serviceNumberSetting
            }]
        }, {
            path: "/openBankManage", //开户行管理
            name: 'openBankManage',
            component: openBankManage
        }, {
            path: "/agreementSetting", //平台协议设置
            name: 'agreementSetting',
            component: agreementSetting
        }, {
            path: "/agreementList", //平台协议列表
            name: 'agreementList',
            component: agreementList
        }, {
            path: "/transTemplate", //运费模板管理
            name: 'transTemplate',
            component: transTemplate
        }, {
            path: "/newTemplate", //运费模板新建
            name: 'newTemplate',
            component: newTemplate
        }, {
            path: "/versionManage", //版本管理
            name: 'versionManage',
            component: versionManage
        }, {
            path: "/subVersion", //子版本
            name: 'subVersion',
            component: subVersion
        }
    ]
}