<template>
    <div class="get-order-setting rider-container">
        <div class="rider-form" :key='refresh'>
            <el-form :model='formData'>
                <h1 class="title">转单倒计时设置</h1>
                <div class="line-flex-start">
                    <!-- <el-input class="rider-input input-100" :size='$size' type='number' :placeholder="placeholder.turnOrderCountDown"
                        v-model='formData.turnOrderCountDown'></el-input> -->
                    <fixed-input class="rider-input input-100" :fixed='1' :placeholder="placeholder.turnOrderCountDown"
                        v-model='formData.turnOrderCountDown'></fixed-input>
                    <span>分钟</span>
                </div>
                <div class="tips">注：在该时间内无人接单，自动取消派单</div>
                <h1 class="title">骑士每单最多转单次数设置:</h1>
                <div class="line-flex-start">
                    <!-- <el-input class="rider-input input-100" :size='$size' type='number' :placeholder="placeholder.turnOrderCount"
                        v-model='formData.turnOrderCount'></el-input> -->
                    <fixed-input class="rider-input input-100" :fixed='0' :placeholder="placeholder.turnOrderCount"
                        v-model='formData.turnOrderCount'></fixed-input>
                    <span>次</span>
                </div>
                <div class="tips">注：超出设置次数后不可转单</div>
                <div>
                    <el-button :size='$size' class='rider-btn submit' @click='submit'>保存</el-button>
                    <el-button :size='$size' class='rider-btn cancel' @click='reset'>清除</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
// import FixedInput from "@/components/all/FixedInput";
import mixin from "./mixin.js";
export default {
    // components: {
    //     FixedInput
    // },
    mixins: [mixin],
    data() {
        return {};
    },
    created() {},
    methods: {
        submit() {
            if (!this.formData.turnOrderCountDown) {
                this.$message.warning("请输入转单倒计时");
                return;
            }
            if (!this.formData.turnOrderCount) {
                this.$message.warning("请输入转单次数");
                return;
            }
            let data = JSON.parse(JSON.stringify(this.formData));
            data.turnOrderCountDown = data.turnOrderCountDown * 60;
            this.$http
                .post(this.$api.platformTransOrderSetting, data, true)
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

