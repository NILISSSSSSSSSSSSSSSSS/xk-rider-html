/**
 * 公共变量
 */

/**
 * baseUrl
 * @type {string}
 */
const testUrl = "/test/";
const local1 = "/local1/";
const locallogin = "/locallogin/";
const dev = "/api/";
export const baseUrl = dev;
export const pTest = false; //权限是否全部打开

/**
 * 签名密匙signKey
 * @type {string}
 */
export const signKey = "e10adc3949ba59abbe56e057f20f883e";

/**
 * data加密密匙dataKey
 * @type {string}
 */
export const dataKey = "c33367701511b4f6020ec61ded352059";

/**
 * 高德地图Key
 * @type {string}
 */
export const amapKey = "5e9ad5d5e4ad3aab0f4b40b578850cc9";

/**
 * 七牛上传路径
 * @type {string}
 */
// export const uploadPath = "http://upload.qiniup.com/";http(s)://://upload-z2.qiniup.com
export const uploadPath = "https://upload-z2.qiniup.com/";

/**
 * 七牛上传图片预览地址
 *
 */
// export const previewPath = "http://pc5n254yj.bkt.clouddn.com/";
// export const previewPath = "http://pe453h5rw.bkt.clouddn.com/";
export const previewPath = "https://gc.xksquare.com/";

/**
 * 正则表达式
 * @type {{}}
 */
export const regex = {
    phone: /^1[34578]\d{9}$/
};

//枚举开奖方式
// export const EnumJDrawType = [{
//         key: 'bytime',
//         value: '按开奖时间'
//     },
//     {
//         key: 'bymember',
//         value: '按开奖进度'
//     },
//     {
//         key: 'bytime_or_bymember',
//         value: '按开奖时间或进度'
//     },
//     {
//         key: 'bytime_and_bymember',
//         value: '按开奖时间和进度'
//     }
// ];

//枚举审核状态
// export const EnumAuditStatus = [{
//         key: '',
//         value: '全部'
//     },
//     {
//         key: 'UNAUDITED',
//         value: '待审核'
//     },
//     {
//         key: 'VERIFIED',
//         value: '已审核'
//     },
//     {
//         key: 'UNAPPROVED',
//         value: '未通过'
//     }
// ]

//枚举福利商城开奖时间类型
// export const EnumWeebday = [{
//         key: 'monday',
//         value: '星期一'
//     },
//     {
//         key: 'tuesday',
//         value: '星期二'
//     },
//     {
//         key: 'wednesday',
//         value: '星期三'
//     },
//     {
//         key: 'thursday',
//         value: '星期四'
//     },
//     {
//         key: 'friday',
//         value: '星期五'
//     },
//     {
//         key: 'saturday',
//         value: '星期六'
//     },
//     {
//         key: 'sunday',
//         value: '星期日'
//     },
//     {
//         key: 'daily',
//         value: '日历'
//     }
// ];

//枚举自营商城订单状态
// export const EnumOrderStatus = [{
//         key: 'PRE_PAY',
//         value: '待支付'
//     },
//     {
//         key: 'PRE_SHIP',
//         value: '待配送'
//     },
//     {
//         key: 'PRE_RECEVICE',
//         value: '待收货'
//     },
//     {
//         key: 'PRE_EVALUATE',
//         value: '待评价'
//     },
//     {
//         key: 'COMPLETELY',
//         value: '已完成'
//     }
// ]

//枚举物流公司
// export const EnumLogisticsName = [{
//         key: 'XK',
//         value: '晓可自营物流'
//     },
//     {
//         key: 'SF',
//         value: '顺丰'
//     },
//     {
//         key: 'YD',
//         value: '韵达'
//     },
//     {
//         key: 'ZT',
//         value: '中通'
//     },
//     {
//         key: 'ST',
//         value: '申通'
//     },
//     {
//         key: 'YT',
//         value: '圆通'
//     },
//     {
//         key: 'BSHT',
//         value: '百世汇通'
//     },
//     {
//         key: 'HIMSELF',
//         value: '用户自行配送'
//     },
// ]

//枚举自营商城售后申请项
// export const EnumRefundType = [{
//         key: '',
//         value: '全部'
//     },
//     {
//         key: 'REFUND',
//         value: '仅退款'
//     },
//     {
//         key: 'REFUND_GOODS',
//         value: '退款退货'
//     }
// ];

//枚举自营商城售后状态
// export const EnumRefundStatus = [{
//         key: 'APPLY',
//         value: '待审核'
//     },
//     {
//         key: 'REFUSED',
//         value: '未通过'
//     },
//     {
//         key: 'PRE_REFUND',
//         value: '待退款'
//     },
//     {
//         key: 'REFUNDING',
//         value: '退款中'
//     },
//     {
//         key: 'PRE_USER_SHIP',
//         value: '待发货'
//     },
//     {
//         key: 'PRE_PLAT_RECEIVE',
//         value: '待收货'
//     },
//     {
//         key: 'COMPLETE',
//         value: '已完成'
//     }
// ]

//枚举自营商城用户订单状态
// export const EnumRefundUserStatus = [{
//         key: 'APPLY',
//         value: '待审核'
//     },
//     {
//         key: 'REFUSED',
//         value: '未通过'
//     },
//     {
//         key: 'PRE_USER_SHIP',
//         value: '待用户发货'
//     },
//     {
//         key: 'PRE_PLAT_RECEIVE',
//         value: '待平台收货'
//     },
//     {
//         key: 'PRE_REFUND',
//         value: '待平台退款'
//     },
//     {
//         key: 'REFUNDING',
//         value: '退款中'
//     },
//     {
//         key: 'COMPLETE',
//         value: '退款完成'
//     },
// ]

// 枚举短信类型
// export const SmsType = [{
//         key: 'AUTH',
//         value: '短信验证码'
//     },
//     {
//         key: 'NOTIFY',
//         value: '通知'
//     },
//     {
//         key: 'EXTENSION',
//         value: '推广短信'
//     }
// ]

// 枚举短信验证码业务类型
// export const AuthType = [{
//         key: 'REGISTER',
//         value: '注册'
//     },
//     {
//         key: 'LOGIN',
//         value: '登录'
//     },
//     {
//         key: 'RESET_PASSWORD',
//         value: '密码重置'
//     },
//     {
//         key: 'RESET_PHONE',
//         value: '修改手机号'
//     },
//     {
//         key: 'BIND_PHONE',
//         value: '绑定手机号'
//     },
//     {
//         key: 'CREATE_BIND_CODE',
//         value: '创建授权码'
//     },
//     {
//         key: 'BIND_SHOP',
//         value: '绑定店铺'
//     },
//     {
//         key: 'DELETE_EMPLOYEE',
//         value: '删除员工'
//     },
//     {
//         key: 'UNBIND_SHOP',
//         value: '解绑店铺'
//     },
//     {
//         key: 'BIND_BANK_CARD',
//         value: '绑定银行卡'
//     },
//     {
//         key: 'UNBIND_BANK_CARD',
//         value: '解绑银行卡'
//     },
//     {
//         key: 'CREATE_SHOP_BIND_MANAGER_PHONE',
//         value: '创建管理员'
//     },
//     {
//         key: 'RESET_MANAGER_PHONE',
//         value: '修改管理员手机号'
//     },
//     {
//         key: 'CREATE_EMPLOYEE',
//         value: '新增员工'
//     },
//     {
//         key: 'RESET_EMPLOYEE_PHONE',
//         value: '修改员工手机号'
//     },
//     {
//         key: 'VALIDATE',
//         value: '验证'
//     }
// ]

// 枚举短信通知业务类型
// export const NotifyType = [{
//         key: 'SEND_BIND_CODE',
//         value: '发送授权码'
//     },
//     {
//         key: 'LIGHTEN_SECURITY_CODE',
//         value: '点亮安全码'
//     },
//     {
//         key: 'EXTINGUISH_SECURITY_CODE',
//         value: '熄灭安全码'
//     },
//     {
//         key: 'NEW_BIND_SECURITY_CODE',
//         value: '新绑定安全码'
//     }
// ]

// 枚举短信推广业务类型
// export const ExtensionType = [{
//     key: '',
//     value: '暂无'
// }]

// 枚举所有短信业务类型
// export const BizType = AuthType.concat(NotifyType, ExtensionType);

//枚举商户类型
// export const EnumMerchantType = [{
//         key: 'EXTENSION_WORKER',
//         value: '个人'
//     },
//     {
//         key: 'ZHUBO',
//         value: '主播'
//     },
//     {
//         key: 'MERCHANT',
//         value: '商户'
//     },
//     {
//         key: 'PARTNER',
//         value: '合伙人'
//     },
//     {
//         key: 'BROKERAGE_FIRM',
//         value: '经济公司'
//     },
// ]

//枚举商品类型
// export const EnumGoodsType = [{
//         key: '',
//         value: '全部'
//     },
//     {
//         key: '1',
//         value: '服务类'
//     },
//     {
//         key: '2',
//         value: '商品类'
//     },
//     {
//         key: '3',
//         value: '外卖类'
//     },
//     {
//         key: '4',
//         value: '住宿类'
//     }
// ]

// 支付渠道
export const payChannel = [
    {
        key: "xkq",
        value: "账户余额"
    },
    {
        key: "xkb",
        value: "晓可币"
    },
    {
        key: "swq",
        value: "实物券"
    },
    {
        key: "xfq",
        value: "消费券"
    },
    {
        key: "xfqs",
        value: "物流余额"
    },
    {
        key: "wls",
        value: "店铺消费券"
    },
    {
        key: "alipay",
        value: "支付宝"
    },
    {
        key: "wxpay",
        value: "微信"
    },
    {
        key: "tfAlipay",
        value: "天府银行-支付宝"
    },
    {
        key: "tfWxpay",
        value: "天府银行-微信"
    },
    {
        key: "applePay",
        value: "苹果内购"
    }
];

// 更新方式
export const updateTypes = [
    {
        label: "全部",
        value: ""
    },
    {
        label: "全量更新",
        value: "all"
    },
    {
        label: "增量更新",
        value: "part"
    }
    // {
    //     label: "热更新",
    //     value: "hot"
    // }
];

// 提现审核状态
export const checkType = [
    {
        value: "submit",
        label: "未审核"
    },
    {
        value: "success",
        label: "未确认"
    },
    {
        value: "confirm",
        label: "提现成功"
    },
    {
        value: "fail",
        label: "提现失败"
    }
];
// 日期选择器option
export const datePickerOption = {
    shortcuts: [
        {
            text: "最近一周",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
            }
        },
        {
            text: "最近一个月",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
            }
        },
        {
            text: "最近三个月",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
            }
        }
    ]
};
