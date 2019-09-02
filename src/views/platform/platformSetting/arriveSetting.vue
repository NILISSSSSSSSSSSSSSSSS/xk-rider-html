<template>
    <div class="arrive-setting rider-container">
        <div class="rider-form" :key='refresh'>
            <el-form @keyup.enter.native='submit' :model='formData'>
                <h1 class="title">送达区域设置</h1>
                <div class="line-flex-start">
                    <span>距离收货地址</span>
                    <!-- <el-input class="rider-input input-100" :size='$size' type='number' :placeholder="placeholder.destinationDistance"
                        v-model='formData.destinationDistance'></el-input> -->
                    <fixed-input class="rider-input input-100" :placeholder="placeholder.destinationDistance" v-model='formData.destinationDistance'
                        :fixed='0'></fixed-input>
                    <span>米,可以点击确认收货</span>
                </div>
                <div class="margin-top-20">
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
    methods: {
        submit() {
            if (!this.formData.destinationDistance) {
                this.$message.warning("请输入设置项");
                return;
            }
            this.$http
                .post(this.$api.platformArriveSetting, this.formData, true)
                .then(res => {
                    console.log("​submit -> res", res);
                    this.$notify({
                        title: "成功",
                        message: "保存成功",
                        type: "success"
                    });
                })
                .catch(d => {
                    console.log("​submit -> err", err);
                    this.$notify({
                        title: "失败",
                        message: "保存失败",
                        type: "warning"
                    });
                });
        }
    }
};
</script>

