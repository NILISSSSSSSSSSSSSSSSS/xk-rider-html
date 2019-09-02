<template>
    <el-dialog :close-on-click-modal="false" class="check-result" :visible.sync="open" width='600px' top='5vh' center
        append-to-body title='拒单审核'>
        <div class="item line-start-start">
            <div class="label">拒单原因:</div>
            <div class="detail">{{detail.message}}</div>
        </div>
        <div class="item line-start-start">
            <div class="label">上传照片:</div>
            <div class="detail">
                <img v-for='item in detail.imgUrls' :key='item' :src="item" @click='$viewImage(item)' />
            </div>
        </div>
        <el-form label-width="100px" :model='formData'>
            <el-form-item label='审核:'>
                <el-radio v-model="formData.authStatus" label="SUCCESS">通过</el-radio>
                <el-radio v-model="formData.authStatus" label="FAILED">不通过</el-radio>
            </el-form-item>
            <el-form-item label='原因:' v-if='formData.authStatus=="FAILED"'>
                <el-input type='textarea' rows="2" v-model='formData.authMessage'></el-input>
            </el-form-item>
        </el-form>
        <div slot='footer'>
            <el-button :size='$size' @click='open=false' :loading="loading">返回</el-button>
            <el-button :size='$size' type='primary' @click='check()' :loading="loading">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { canUse } from "./../../menu/permission.js";
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        detail: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            open: this.show,
            formData: {
                authStatus: "FAILED",
                authMessage: ""
            },
            loading: false
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
        check() {
            if (!canUse("dealRefuseOrder")) return;
            this.loading = true;
            let data = { ...this.formData, id: this.detail.id };
            this.$http
                .post(this.$api.orderRefuseDeal, data, true)
                .then(res => {
                    console.log("​check -> res", res);
                    this.$notify({
                        title: "成功",
                        message: "审核成功",
                        type: "success"
                    });
                    this.open = false;
                    this.loading = false;
                    this.$emit("success");
                })
                .catch(err => {
                    this.$notify({
                        title: "失败",
                        message: "审核失败",
                        type: "warning"
                    });
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.check-result {
    $item-padding: 0 40px;
    /deep/ .title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
    }
    /deep/ .el-button {
        margin-top: 10px;
    }
    /deep/ .checked {
        padding: $item-padding;
        font-size: 14px;
        line-height: 40px;
        label {
            width: 120px;
            text-align: center;
        }
        .detail {
            width: 400px;
            text-align: left;
        }
    }
    .el-form {
        padding: $item-padding;
    }
    .el-form-item {
        margin-bottom: 10px;
    }
    .item {
        margin: 15px 0;
        padding: $item-padding;
        &:first-child {
            margin-top: 0;
        }
        .label {
            width: 100px;
            text-align: right;
            font-weight: bold;
        }
        .detail {
            flex: 1;
            padding-left: 20px;
            img {
                min-width: 120px;
                max-width: 150px;
                min-height: 90px;
                background: #ddd;
                &:nth-child(2n + 1) {
                    margin-right: 5px;
                }
            }
        }
    }
    .item-big-picture {
        flex-wrap: wrap;
        padding: $item-padding;
        .label {
            width: 150px;
            text-align: center;
            font-weight: bold;
        }
        .detail {
            width: 100%;
            margin: 15px 0;
            img {
                min-width: 160px;
                max-width: 200px;
                min-height: 90px;
                background: #ddd;
                margin: 0 15px;
            }
        }
    }
}
</style>
