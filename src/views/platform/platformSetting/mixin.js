import {
    formatToMinute,
    formatToSecond,
    formatToPercent,
    format1To100,
    format100To1
} from "./../../../util/filterMethods";
import FixedInput from "./../../../components/all/FixedInput.vue";
export default {
    components: { FixedInput },
    data() {
        return {
            formData: {},
            placeholder: {},
            nowTab: this.$route.path.replace("/", ""),
            refresh: new Date().getTime(),
            settingType: [
                {
                    label: "接单设置",
                    value: "getOrderSetting",
                    type: "ACCESS_ORDER"
                },
                {
                    label: "转单设置",
                    value: "transOrderSetting",
                    type: "TRANS_ORDER"
                },
                {
                    label: "异常处理设置",
                    value: "errorDealSetting",
                    type: "EXCEPTION_ORDER"
                },
                {
                    label: "拒单设置",
                    value: "refuseSetting",
                    type: "REFUSE_ORDER"
                },
                {
                    label: "送达设置",
                    value: "arriveSetting",
                    type: "RIDER_ARRIVE"
                },
                {
                    label: "客服电话设置",
                    value: "serviceNumberSetting",
                    type: "PLATFORM_CUSTOMER"
                },
                {
                    label: "提现额度设置",
                    value: "withdrawLimit",
                    type: "DRAW_MONEY_AMOUNT"
                },
                {
                    label: "提现手续费设置",
                    value: "feeSetting",
                    type: "DRAW_MONEY_POUNDAGE"
                }
            ]
        };
    },
    computed: {
        nowType() {
            for (let i of this.settingType) {
                if (i.value == this.nowTab) {
                    return i.type;
                }
            }
        }
    },
    created() {
        console.log(this.nowTab);
        this.getDetail();
    },
    methods: {
        getDetail() {
            this.$http
                .get(
                    this.$api.platformConfigDetail,
                    {
                        configKey: this.nowType,
                        guid: "xk-pc"
                    },
                    true
                )
                .then(res => {
                    console.log("​getSettingDetail -> res", res);
                    if (res) {
                        if (res.orderTakingCountDown) {
                            // res.orderTakingCountDown =
                            //     res.orderTakingCountDown / 60;
                            res.orderTakingCountDown = formatToMinute(
                                res.orderTakingCountDown
                            );
                        }
                        if (res.turnOrderCountDown) {
                            res.turnOrderCountDown = formatToMinute(
                                res.turnOrderCountDown
                            );
                        }
                        if (res.drawAmount) {
                            res.drawAmount = format100To1(res.drawAmount);
                        }
                        if (res.drawAmountNotAuth) {
                            res.drawAmountNotAuth = format100To1(
                                res.drawAmountNotAuth
                            );
                        }
                        this.form = res;
                        this.placeholder = res;
                        if (res.poundage && res.poundage.length > 0) {
                            this.feeForm = res.poundage;
                        }
                    }
                })
                .catch(err => {
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    console.log("​getSettingDetail -> err", err);
                });
        },
        reset() {
            this.refresh = new Date().getTime();
            this.formData = {};
        }
    }
};
