<template>
    <el-dialog :close-on-click-modal="false" class="widthdraw-check" :title='title' :visible.sync="open" append-to-body
        center width='600px' top="20vh">
        <div class="body" v-if='Object.keys(checkItem).length>0'>
            <div class="item">
                <label>提现单号:</label>
                <span class="detail">{{checkItem.orderNo}}</span>
            </div>
            <div class="item">
                <label>申请时间:</label>
                <span class="detail">{{checkItem.createdAt|formatTime}}</span>
            </div>
            <div class="item">
                <label>骑士ID:</label>
                <span class="detail">{{checkItem.userId}}</span>
            </div>
            <!-- <div class="item">
                <label>用户类型:</label>
                <span class="detail">123123123</span>
            </div> -->
            <div class="item">
                <label>用户名称:</label>
                <span class="detail">{{checkItem.realName}}</span>
            </div>
            <div class="item">
                <label>用户手机号:</label>
                <span class="detail">{{checkItem.phone}}</span>
            </div>
            <div class="item">
                <label>提现金额:</label>
                <span class="detail">{{checkItem.amount|formatPrice}}</span>
            </div>

            <div class="item">
                <label>提现银行:</label>
                <span class="detail">{{checkItem.bankName}}</span>
            </div>
            <div class="item">
                <label>银行卡号:</label>
                <span class="detail">{{checkItem.cardNum}}</span>
            </div>
            <!-- <div class="item">
                <label>预留手机号:</label>
                <span class="detail">123123123</span>
            </div> -->
            <!-- <div class="item">
                <label>持卡人姓名:</label>
                <span class="detail">123123123</span>
            </div> -->
            <div class="item">
                <label>账户余额:</label>
                <span class="detail">{{checkItem.balance|formatPrice}}</span>
            </div>
        </div>
        <div class="footer" slot='footer' v-if='Object.keys(checkItem).length>0'>
            <Check v-if='status=="submit"' :show.sync='open' v-bind='$attrs' v-on='$listeners'></Check>
            <Confirm v-else-if='status=="success"' :show.sync='open' v-bind='$attrs' v-on='$listeners'></Confirm>
            <Info :show.sync='open' v-else :item="checkItem"></Info>
        </div>
    </el-dialog>
</template>
<script>
import Check from "./WithdrawCheck";
import Confirm from "./WithdrawConfirm";
import Info from "./WithdrawInfo";
export default {
    components: {
        Check,
        Confirm,
        Info
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isChecked: {
            type: Boolean,
            default: false
        },
        status: {
            type: String
        }
    },
    data() {
        return {
            open: this.show,
            // checkValue: "FAILED",
            // reason: "",
            checkItem: {}
        };
    },
    watch: {
        show(val) {
            this.open = val;
            if (val) {
                this.getDetail();
            }
        },
        open(val) {
            this.$emit("update:show", val);
            if (!val) {
                this.checkItem = {};
            }
        }
    },
    computed: {
        title() {
            let status = this.status;
            return status == "submit"
                ? "提现审核"
                : status == "success"
                ? "提现确认"
                : "提现详情";
        }
    },
    methods: {
        getDetail() {
            this.$http
                .get(
                    this.$api.financeCheckDetail,
                    {
                        id: this.$attrs.item.id
                    },
                    true
                )
                .then(res => {
                    console.log("TCL: getDetail -> res", res);
                    this.checkItem = res;
                })
                .catch(err => {
                    console.log("TCL: getDetail -> err", err);
                    this.$message.error("获取详情失败");
                    this.open = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.widthdraw-check {
    $font-size: 13px;
    @mixin item {
        width: 50%;
        line-height: 30px;
        text-align: left;
        font-size: $font-size;
        color: #333;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        label,
        span {
            display: inline-block;
            word-wrap: break-word;
            word-break: normal;
        }
        label {
            width: 80px;
            text-align: left;
        }
        span {
            width: 180px;
        }
    }
    .body {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        .item {
            @include item;
        }
    }
    /deep/ .el-dialog__footer {
        padding-left: 25px;
    }

    // .footer {
    //     .checked {
    //         display: flex;
    //         justify-content: flex-start;
    //         align-items: center;
    //         .item {
    //             @include item;
    //         }
    //     }
    //     .need-check {
    //         text-align: left;
    //         font-size: $font-size;
    //         label {
    //             margin-right: 25px;
    //         }
    //         .btn-group {
    //             text-align: center;
    //             margin-top: 25px;
    //         }
    //     }
    // }
}
</style>
