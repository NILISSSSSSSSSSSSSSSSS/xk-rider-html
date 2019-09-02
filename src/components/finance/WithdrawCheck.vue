
<template>
    <!-- checked -->
    <div class="need-check">
        <div class="margin-bottom-20">
            <label>提现状态 :</label>
            <span>{{findType(this.$attrs.item.drawStatus)}}</span>
        </div>
        <label>审核 :</label>
        <el-radio-group v-model='checkValue'>
            <el-radio label='success'>同意</el-radio>
            <el-radio label='fail'>不同意</el-radio>
        </el-radio-group>
        <el-input class="reason" type='textarea' v-model='reason' placeholder="审核不通过原因" v-if='checkValue=="fail"'></el-input>
        <div class="btn-group">
            <el-button type='' :size='$size' @click='open=false' :loading="btnLoading">返回</el-button>
            <el-button type='primary' :size='$size' @click='submit' :loading="btnLoading">确定</el-button>
        </div>
    </div>
</template>
<script>
import mixin from "./CheckConfirmMixin.js";
import dialogMixin from "./dialogMixin.js";
export default {
    mixins: [mixin,dialogMixin],
    props: {
        show: {
            type: Boolean
        }
    },
    data() {
        return {
            open: this.show,
            checkValue: "fail",
            reason: ""
        };
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            this.$emit("update:show", val);
        }
    },
    methods: {
        submit() {
            if (this.checkValue == "fail" && !this.reason) {
                this.$message.warning("请输入拒绝原因");
                return;
            }
            let ids = [this.$attrs.item.id];
            let authMessage = this.reason;
            let drawStatus = this.checkValue;
            this.checkItems({ ids, authMessage, drawStatus }, () => {
                this.$emit("success");
                this.open = false;
            });
        }
    }
};
</script>
<style lang="scss" scoped src='./check.scss'></style>
