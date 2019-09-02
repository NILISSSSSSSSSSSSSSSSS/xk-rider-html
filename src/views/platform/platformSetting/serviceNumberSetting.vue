<template>
    <div class="service-number-setting rider-container">
        <div class="rider-form">
            <el-form @keyup.enter.native='submit' :model='formData'>
                <h1 class="title">客服联系电话设置</h1>
                <div class="line-flex-start">
                    <el-input class="rider-input" :size='$size' type='number' :placeholder="placeholder.platformPhone"
                        v-model='formData.platformPhone'></el-input>
                </div>
                <div class="margin-top-20">
                    <el-button :size='$size' class='rider-btn submit' @click='submit'>保存</el-button>
                    <el-button :size='$size' class='rider-btn cancel' @click='reset'>清除</el-button>
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
            if (!this.formData.platformPhone) {
                this.$message.warning("请输入设置项");
                return;
            }
            if (this.formData.platformPhone.length>12) {
                this.$message.warning("请正确输入电话号码");
                return;
            }

            this.$http
                .post(
                    this.$api.platformServiceNumberSetting,
                    this.formData,
                    true
                )
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