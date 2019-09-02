<template>
    <div class="refuse-setting rider-container">
        <div class="rider-form">
            <el-form>
                <h1 class="title">拒单理由设置</h1>
                <div class="line-flex-start" v-for='(item,index) in form.refuseOrderReason' :key='index'>
                    <span>理由{{index+1}}:</span>
                    <el-input class='rider-input input-350 margin-right-20' :size='$size' placeholder="拒单理由" v-model='form.refuseOrderReason[index]'></el-input>
                    <el-button :size='$size' type='primary' class="" :disabled="!((form.refuseOrderReason[index])&&(form.refuseOrderReason.length-1==index))"
                        @click='add'>新增</el-button>
                    <el-button :size='$size' type='danger' class="" :disabled="form.length===1" @click='remove(item)'>删除</el-button>
                </div>
                <div>
                    <el-button :size='$size' class="rider-btn submit margin-top-20" :disabled="!form.refuseOrderReason[0]"
                        @click="submit()">
                        保存</el-button>
                    <el-button :size='$size' @click='resetList()' class="rider-btn cancel margin-top-20">
                        清除</el-button>
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
        return {
            form: { refuseOrderReason: [""] }
        };
    },
    computed: {
        mForm() {
            if (
                !this.form.refuseOrderReason[
                    this.form.refuseOrderReason.length - 1
                ]
            ) {
                this.form.refuseOrderReason.length =
                    this.form.refuseOrderReason.length - 1;
            }
            return this.form;
        }
    },
    methods: {
        resetList() {
            this.form.refuseOrderReason = [""];
        },
        add() {
            this.form.refuseOrderReason.push("");
        },
        remove(item) {
            var index = this.form.refuseOrderReason.indexOf(item);
            if (index !== -1) {
                this.form.refuseOrderReason.splice(index, 1);
            }
        },
        submit() {
            this.$http
                .post(this.$api.platformRefuseOrderSetting, this.mForm, true)
                .then(res => {
                    console.log("​submit -> res", res);
                    this.$notify({
                        title: "提示",
                        message: "设置成功",
                        type: "success"
                    });
                })
                .catch(err => {
                    console.log("​submit -> err", err);
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


