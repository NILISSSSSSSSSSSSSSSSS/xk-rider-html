<template>
    <div class="withdraw-limit rider-container">
        <div class="rider-switch">
            <div class="tab active">提现额度设置</div>
            <div class="tab" @click='$router.push("feeSetting")' v-if='financeWithdrawFeeSetting'>提现手续费设置</div>
        </div>
        <el-form label-width="50px" :model="formData" class="rider-form">
            <!-- ============= -->
            <h1 class="title">单日最高提现次数设置</h1>
            <el-form-item>
                <positive-input type='number' :size="$size" class="rider-input" v-model='formData.drawTimes'
                    :placeholder="placeholder.drawTimes||'请输入单日最高提现次数'" suffix='次'>
                </positive-input>
            </el-form-item>
            <div class="tips">注 : 高于单日提现次数用户不能提现</div>
            <!-- ============ -->
            <h1 class="title">单日提现最高额度设置</h1>
            <el-form-item>
                <positive-input type='number' :size="$size" class="rider-input" v-model='formData.drawAmount'
                    :placeholder="placeholder.drawAmount||'请输入单日提现最高额度'" suffix='元'>
                </positive-input>
            </el-form-item>
            <div class="tips">注 : 用户单日提现总额不可超过该值</div>
            <!-- ============= -->
            <h1 class="title">提现免审核额度设置</h1>
            <el-form-item>
                <positive-input type='number' :size="$size" class="rider-input" v-model='formData.drawAmountNotAuth'
                    :placeholder="placeholder.drawAmountNotAuth||'请输入免审核额度'" suffix='元'>
                </positive-input>
            </el-form-item>
            <div class="tips">注 : 小于该金额数的提现操作将不通过审核直接进行提现</div>
            <div class="btn-group">
                <el-button :size="$size" @click='$router.go(-1);'>返回</el-button>
                <el-button type="primary" :size="$size" @click='submit()'>保存</el-button>
            </div>
        </el-form>

    </div>
</template>
<script>
import mixin from "./../../platformSetting/mixin.js";
import { financeWithdrawFeeSetting } from "./../../../../menu/permission.js";
import PositiveInput from "./../../../../components/all/PositiveNumInput";
export default {
    mixins: [mixin],
    components: {
        PositiveInput
    },
    data() {
        return {
            financeWithdrawFeeSetting,
            formData: {}
        };
    },
    computed: {
        mFormData() {
            return {
                ...this.formData,
                drawAmount: this.formData.drawAmount * 100,
                drawAmountNotAuth: this.formData.drawAmountNotAuth * 100
            };
        }
    },
    methods: {
        submit() {
            console.log(this.formData);
            if (
                !this.formData.drawTimes ||
                !this.formData.drawAmount ||
                !this.formData.drawAmountNotAuth
            ) {
                this.$message.warning("请补全设置项");
                return;
            }
            this.$http
                .post(this.$api.platformWithdrawLimit, this.mFormData, true)
                .then(res => {
                    this.$notify.success({
                        title: "成功",
                        message: "设置成功"
                    });
                })
                .catch(err => {
                    this.$message.error("设置失败 错误码:" + err.code);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.withdraw-limit {
    width: 100%;
    .el-form-item {
        width: 50%;
    }
}
</style>