<template>
    <div class="get-order-setting rider-container">
        <div class="rider-form" :key='refresh'>
            <el-form :model='formData'>
                <!-- ==================== -->
                <h1 class="title">商户派单次数设置</h1>
                <div class="line-flex-start">
                    <!-- <el-input class="rider-input input-100" :size='$size' :placeholder="placeholder.merchantSendOrderCountException"
                        v-model="formData.merchantSendOrderCountException"></el-input> -->
                    <fixed-input class="rider-input input-100" :placeholder="placeholder.merchantSendOrderCountException"
                        v-model="formData.merchantSendOrderCountException" :fixed='0'></fixed-input>
                    <span>次</span>
                </div>
                <div class="tips">注：商户派单次数超过设置次数后无人接单，订单自动转到一级异常列表</div>
                <!-- ==================== -->
                <h1 class="title">区域负责人派单次数设置</h1>
                <div class="line-flex-start">
                    <!-- <el-input class="rider-input input-100" :size='$size' :placeholder="placeholder.partnerSendOrderCountException"
                        v-model='formData.partnerSendOrderCountException'></el-input> -->
                    <fixed-input class="rider-input input-100" :placeholder="placeholder.partnerSendOrderCountException"
                        v-model='formData.partnerSendOrderCountException' :fixed='0'></fixed-input>
                    <span>次</span>
                </div>
                <div class="tips">注：区域负责人派单次数超过设置次数后无人接单，订单自动转到二级异常列表</div>
                <!-- ==================== -->

                <!-- <h1 class="title">超时监控设置</h1>
                <div class="line-flex-start">
                    <span>订单超时</span>
                    <el-input class="rider-input input-100" :size='$size' placeholder=""></el-input>
                    <span>分钟进入超时订单列表</span>
                </div>
                <div class="tips">注：在该时间内未处理，后台自动排单</div> -->

                <!-- ==================== -->
                <!-- <h1 class="title">二级异常订单设置</h1>
                <div class="line-flex-start">
                    <el-input
                        class="rider-input input-100"
                        :size='$size'
                        :placeholder="placeholder.twoExceptionTimeAuto"
                        v-model='formData.twoExceptionTimeAuto'
                    ></el-input>
                    <span>分钟</span>
                </div>
                <div class="tips">注：在该时间内未处理，后台自动排单</div> -->
                <!-- ===================== -->
                <div>
                    <el-button :size='$size' class='rider-btn submit' @click='submit()'>保存</el-button>
                    <el-button :size='$size' class='rider-btn cancel' @click='reset()'>清除</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import mixin from "./mixin.js";
export default {
    mixins: [mixin],
    data() {
        return {};
    },
    methods: {
        submit() {
            if (!this.formData.merchantSendOrderCountException) {
                this.$message.warning("请输入商户派单次数");
                return;
            }
            if (!this.formData.partnerSendOrderCountException) {
                this.$message.warning("请输入区域负责人派单次数");
                return;
            }
            // if (!this.formData.oneExceptionTimeAuto) {
            //     this.$message.warning("请输入一级异常订单等待分钟数");
            //     return;
            // }
            // if (!this.formData.twoExceptionTimeAuto) {
            //     this.$message.warning("请输入二级异常订单等待分钟数");
            //     return;
            // }
            this.$http
                .post(this.$api.platformErrorOrderSetting, this.formData, true)
                .then(res => {
                    this.$notify({
                        title: "提示",
                        message: "设置成功",
                        type: "success"
                    });
                })
                .catch(err => {
                    this.$notify({
                        title: "提示",
                        message: "设置失败",
                        type: "danger"
                    });
                });
        }
    }
};
</script>

