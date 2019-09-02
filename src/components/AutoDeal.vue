<template>
    <!-- <transition name='fade-transverse'> -->
    <div class="auto-deal rider-search auto">
        <el-form :model='autoForm'>
            <h1 class="title">自动审核</h1>
            <div class="line-flex-start">
                <span>自动审核</span>
                <el-switch v-model='autoForm[autoType.type].autoAuthIsOpen' :active-value="1" :inactive-value="0"
                    @mousedown.native="clickSwitch=true" :disabled="switchLock"></el-switch>
                <span>订单进入异常列表</span>
                <el-input class="rider-input input-100" :size='$size' type='number' v-model="autoForm[autoType.type].authDuration"></el-input>
                <span>秒后,自动</span>
                <el-select class="rider-input input-150" :size='$size' v-model="autoForm[autoType.type].autoOperate">
                    <el-option v-for='item in options' :key='item.value' :value='item.value' :label='item.label'></el-option>
                </el-select>
                <!-- 身份,健康,取消订单等自动审核   不通过状态为FAILED -->
                <span v-if='autoForm[autoType.type].autoOperate=="FAILED"'>不通过原因</span>
                <el-input v-if='autoForm[autoType.type].autoOperate=="FAILED"' class="rider-input input-350" :size='$size'
                    v-model="autoForm[autoType.type].extraContent"></el-input>
                <!-- 提现自动审核  不通过状态为fail -->
                <span v-if='autoForm[autoType.type].autoOperate=="fail"'>不通过原因</span>
                <el-input v-if='autoForm[autoType.type].autoOperate=="fail"' class="rider-input input-350" :size='$size'
                    v-model="autoForm[autoType.type].extraContent"></el-input>
            </div>
        </el-form>
    </div>
    <!-- </transition> -->
</template>
<script>
import {
    autoCheckHealth,
    autoCheckID,
    autoDealOrder,
    autoDealRefuseSetting
} from "./../menu/permission.js";
export default {
    props: {
        autoType: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            autoCheckHealth,
            autoCheckID,
            autoDealOrder,
            autoDealRefuseSetting,
            options: [
                { value: "SUCCESS", label: "审核通过" },
                { value: "FAILED", label: "审核不通过" }
            ],
            autoForm: {
                IDCARD_AUTO_AUTH: {},
                HEALTHCAR_AUTO_AUTH: {},
                TWO_EXCEPTION_ORDER_AUTO_DISPATCH: {},
                CANCEL_ORDER_AUTO_AUTH: {},
                DRAW_MONEY_AUTO_AUTH: {}
            },
            // 参照
            contrast: {
                IDCARD_AUTO_AUTH: "{}",
                HEALTHCAR_AUTO_AUTH: "{}",
                TWO_EXCEPTION_ORDER_AUTO_DISPATCH: "{}",
                CANCEL_ORDER_AUTO_AUTH: "{}",
                DRAW_MONEY_AUTO_AUTH: "{}"
            },
            clickSwitch: false,
            switchLock: false
        };
    },
    created() {
        this.getAutoStatus();
    },
    watch: {
        // 判断是否进行内容修改,对开关进行操作
        autoForm: {
            handler(newV, oldV) {
                let type = this.autoType.type;
                let old = JSON.parse(this.contrast[type]);
                let {
                    autoOperate = null,
                    extraContent = null,
                    authDuration = null
                } = old;

                if (!this.clickSwitch) {
                    if (newV[type]) {
                        if (
                            newV[type].autoOperate != autoOperate ||
                            newV[type].extraContent != extraContent ||
                            newV[type].authDuration != authDuration
                        ) {
                            this.autoForm[type].autoAuthIsOpen = 0;
                        }
                    }
                    return;
                }

                this.check();

                this.clickSwitch = false;
            },
            deep: true
        }
    },
    methods: {
        getAutoStatus() {
            let { type } = this.autoType;
            if (type == "TWO_EXCEPTION_ORDER_AUTO_DISPATCH") {
                //二级异常订单
                this.options = [
                    { value: "wait_rider", label: "派单" },
                    { value: "order_cancel", label: "取消订单" }
                ];
            }
            if (type == "DRAW_MONEY_AUTO_AUTH") {
                //提现
                this.options = [
                    { value: "success", label: "审核通过" },
                    { value: "fail", label: "审核不通过" }
                ];
            }
            let api = this.$api.platformConfigDetail;
            this.$http
                .get(
                    api,
                    {
                        configKey: type
                    },
                    true
                )
                .then(res => {
                    console.log("​getAutoStatus -> res", res);
                    if (!res) return;
                    this.contrast[type] = JSON.stringify(res);
                    this.autoForm[type] = res;
                })
                .catch(err => {
                    this.$message.error("获取自动设置失败");
                });
            // context.commit('saveState')
        },
        setAutoStatus() {
            let { type } = this.autoType;
            let api = "";
            let canSet = false;
            this.switchLock = true;
            switch (type) {
                case "IDCARD_AUTO_AUTH": //身份证
                    canSet = autoCheckID;
                    api = Vue.prototype.$api.autoIDcheck;
                    break;
                case "HEALTHCAR_AUTO_AUTH": //健康证
                    canSet = autoCheckHealth;
                    api = Vue.prototype.$api.autoHealthCheck;
                    break;
                case "TWO_EXCEPTION_ORDER_AUTO_DISPATCH": //二级异常订单
                    canSet = autoDealOrder;
                    api = Vue.prototype.$api.autoErrorOrderLevelTwo;
                    break;
                case "CANCEL_ORDER_AUTO_AUTH": //取消订单
                    canSet = autoDealRefuseSetting;
                    api = Vue.prototype.$api.autoRefuseOrder;
                    break;
                case "DRAW_MONEY_AUTO_AUTH": //提现
                    canSet = true;
                    api = Vue.prototype.$api.financeAutoCheck;
                    break;
                default:
                    break;
            }
            if (!canSet) {
                this.$message.error("没有自动设置权限");
                return;
            }
            this.$http
                .post(api, this.autoForm[this.autoType.type], true)
                .then(res => {
                    console.log("​setAutoStatus -> res", res);
                    this.contrast[this.autoType.type] = JSON.stringify(
                        this.autoForm[this.autoType.type]
                    );
                    this.switchLock = false;
                    this.$message.success("设置成功");
                })
                .catch(err => {
                    console.log("​setAutoStatus -> err", err);
                    this.switchLock = false;
                    this.$message.error("设置失败");
                });
            // context.commit('saveState')
        },
        check() {
            let form = this.autoForm[this.autoType.type];
            if (form.autoAuthIsOpen == 1) {
                if (!form.authDuration) {
                    //没有延迟时间
                    this.$message.warning("开启必须要完整的设置信息");
                    form.autoAuthIsOpen = 0;
                    return;
                }
                if (!form.autoOperate) {
                    //没有操作状态
                    this.$message.warning("开启必须要完整的设置信息");
                    form.autoAuthIsOpen = 0;
                    return;
                }
                if (
                    (form.autoOperate === "FAILED" ||
                        form.autoOperate === "fail") &&
                    !form.extraContent
                ) {
                    //如果不通过,必须要有不通过原因
                    this.$message.warning("开启必须要完整的设置信息");
                    form.autoAuthIsOpen = 0;
                    return;
                }
            }
            this.setAutoStatus();
        }
    }
};
</script>

