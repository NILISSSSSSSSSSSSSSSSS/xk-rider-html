<template>
    <div class="get-order-setting rider-container">
        <div class="rider-form" :key='refresh'>
            <el-form @keyup.enter.native='submit' :model='formData'>
                <h1 class="title">接单倒计时设置</h1>
                <div class="line-flex-start">
                    <!-- <el-input class="rider-input input-100" :size='$size' type='number' :placeholder="placeholder.orderTakingCountDown"
                        v-model='formData.orderTakingCountDown'></el-input> -->
                    <fixed-input class="rider-input input-100" :fixed='1' :placeholder="placeholder.orderTakingCountDown"
                        v-model='formData.orderTakingCountDown'></fixed-input>
                    <span>分钟</span>
                </div>
                <div class="tips">注：在该时间内无人接单，自动取消派单</div>
                <div>
                    <el-button :size='$size' class='rider-btn submit' @click='submit'>保存</el-button>
                    <el-button :size='$size' class='rider-btn cancel' @click='reset'>清除</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import mixin from "./mixin";
// import FixedInput from "./../../../components/all/FixedInput.vue";
import { formatToSecond } from "./../../../util/filterMethods";
export default {
    // components: {
    //     FixedInput
    // },
    mixins: [mixin],
    data() {
        return {};
    },
    methods: {
        submit() {
            if (!this.formData.orderTakingCountDown) {
                this.$message.warning("请输入设置项");
                return;
            }
            let data = JSON.parse(JSON.stringify(this.formData));
            // data.orderTakingCountDown = data.orderTakingCountDown * 60;
            data.orderTakingCountDown = formatToSecond(
                data.orderTakingCountDown
            );
            this.$http
                .post(this.$api.platformGetOrderSetting, data, true)
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

