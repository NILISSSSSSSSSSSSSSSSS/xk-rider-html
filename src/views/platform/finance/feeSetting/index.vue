<template>
    <div class="fee-setting rider-container">
        <div class="rider-switch">
            <div class="tab" @click='$router.push("withdrawLimit")' v-if='financeWithdrawLimitSetting'>提现额度设置</div>
            <div class="tab active">提现手续费设置</div>
        </div>
        <el-form label-width="120px" class="rider-form">
            <h1 class="title">提现手续费区间设置</h1>
            <div class="line-flex-start" v-for='(item,index) in formData' :key='index'>
                <positive-input v-model='item.startAmount' class='rider-input input-100' suffix='元'></positive-input>
                <span>~</span>
                <positive-input v-model='item.endAmount' class='rider-input input-100' suffix='元'></positive-input>
                <span>时，提现手续费为</span>
                <positive-input v-model='item.ratio' class='rider-input input-100 margin-right-20' suffix='%'></positive-input>
                <el-button :size='$size' type='primary' class="" :disabled="!(item.startAmount+''&&item.endAmount+''&&item.ratio+'')"
                    @click='add'>新增</el-button>
                <el-button :size='$size' type='danger' class="" :disabled="formData.length===1" @click='remove(item)'>删除</el-button>
            </div>
            <el-button type='primary' :size='$size' class='margin-left-10 rider-btn' style='margin-top:30px;' @click='submit'>保存</el-button>
        </el-form>
    </div>
</template>
<script>
import PositiveInput from "./../../../../components/all/PositiveNumInput";
import mixin from "./../../platformSetting/mixin.js";
import { financeWithdrawLimitSetting } from "./../../../../menu/permission.js";
import {
    format100To1,
    formatToPercent,
    format1To100
} from "./../../../../util/filterMethods";
export default {
    mixins: [mixin],
    components: {
        PositiveInput
    },
    data() {
        return {
            financeWithdrawLimitSetting,
            formData: [{ startAmount: "", endAmount: "", ratio: "" }],
            feeForm: []
        };
    },
    // computed: {
    //     nowTime() {
    //         return new Date().getTime();
    //     }
    // },
    watch: {
        feeForm(val) {
            if (val.length > 0) {
                let arr = [];
                for (let item of val) {
                    let one = {};
                    one.startAmount = format100To1(item.startAmount);
                    one.endAmount = format100To1(item.endAmount);
                    one.ratio = format1To100(item.ratio);
                    // one.startAmount = item.startAmount / 100;
                    // one.endAmount = item.endAmount / 100;
                    // one.ratio = item.ratio * 100;
                    arr.push(one);
                }
                this.formData = arr;
            }
        }
    },
    methods: {
        check(formData) {
            let form = JSON.parse(JSON.stringify(formData));
            let last = form[form.length - 1];
            if (
                !(last.startAmount + "") &&
                !(last.endAmount + "") &&
                !(last.ratio + "")
            ) {
                form.pop();
            }
            if (form.length == 0) {
                this.$message.error("表单数据为空");
                return;
            }
            let newForm = [];
            for (let i in form) {
                console.log("TCL: check -> form   i", form[i]);
                if (
                    !(
                        form[i].startAmount + "" &&
                        form[i].endAmount + "" &&
                        form[i].ratio + ""
                    )
                ) {
                    this.$message.info(`请补全或修正第${i - 0 + 1}项`);
                    return;
                }
                newForm.push({
                    // startAmount: form[i].startAmount * 100,
                    // endAmount: form[i].endAmount * 100,
                    // ratio: form[i].ratio / 100
                    startAmount: format1To100(form[i].startAmount),
                    endAmount: format1To100(form[i].endAmount),
                    ratio: formatToPercent(form[i].ratio)
                });
            }
            return newForm;
        },
        submit() {
            let mFormData = this.check(this.formData);
            console.log("TCL: submit -> mFormData", mFormData);
            if (mFormData.length > 0) {
                let data = { poundage: mFormData };
                this.$http
                    .post(this.$api.platformFeeSetting, data, true)
                    .then(res => {
                        console.log("TCL: submit -> res", res);
                        this.$notify.success({
                            title: "成功",
                            message: "提交成功"
                        });
                    })
                    .catch(err => {
                        console.log("TCL: submit -> err", err);
                        this.$message.error("提交失败 错误码:" + err.code);
                    });
            }
        },
        add() {
            this.formData.push({
                startAmount: "",
                endAmount: "",
                ratio: ""
            });
        },
        remove(item) {
            var index = this.formData.indexOf(item);
            if (index !== -1) {
                this.formData.splice(index, 1);
            }
        }
        // back() {
        //     this.$router.go(-1);
        // }
    }
};
</script>

