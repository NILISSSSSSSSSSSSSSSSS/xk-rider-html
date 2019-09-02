<template>
    <el-dialog :close-on-click-modal="false" class="transaction" v-if='detail' title='交易详情' :visible.sync="open"
        append-to-body center width='700px' top="20vh">
        <h3>交易信息</h3>
        <div class="container detail">
            <ul>
                <li>
                    <span>流水号:</span>
                    <span>{{detail.orderNo}}</span>
                </li>
                <li>
                    <span>配送订单号:</span>
                    <span>{{detail.dispatchOrderNo}}</span>
                </li>
                <li>
                    <span>订单类型:</span>
                    <span>{{detail.orderType=='food'?"食品类":"非食品类"}}</span>
                </li>
                <li>
                    <span>所属区域:</span>
                    <span>{{detail.provinceCode|getProvinceName}}-{{detail.cityCode|getCityName}}-{{detail.districtCode|getDistrictName}}</span>
                </li>
                <li>
                    <span>原配送费:</span>
                    <span>{{detail.amount|formatPrice}}</span>
                </li>
                <li>
                    <span>平台抽成金额:</span>
                    <span>{{detail.drawOutAmount|formatPrice}}</span>
                </li>
                <li>
                    <span>平台支出金额:</span>
                    <span>{{(detail.amount-detail.drawOutAmount)|formatPrice}}</span>
                </li>
                <li>
                    <span>交易时间:</span>
                    <span>{{detail.tradeAt|formatTime}}</span>
                </li>
            </ul>
        </div>
        <h3 v-if='detail.account'>支出账户</h3>
        <div class="container out" v-if='detail.account'>
            <ul v-for='(item,index) in detail.account' :key='index'>
                <li>
                    <span>支出账户{{index+1}} ID:</span>
                    <span>{{item.userId}}</span>
                </li>
                <li>
                    <span>支出金额:</span>
                    <span>{{item.amount|formatPrice}}</span>
                </li>
            </ul>
        </div>
    </el-dialog>
</template>

<script>
import dialog from "./dialogMixin.js";
export default {
    props: {
        detail: {
            type: Object,
            default: null
        }
    },
    mixins: [dialog],
    data() {
        return {};
    }
};
</script>
<style lang="scss" scoped>
.transaction {
    h3 {
        font-weight: bold;
    }
    .container {
        margin-bottom: 10px;
        margin-top: 10px;
    }
    ul {
        display: flex;
        flex-wrap: wrap;
        li {
            width: 50%;
            line-height: 40px;
            span {
                display: inline-block;
                &:first-child {
                    width: 110px;
                }
            }
        }
    }
}
</style>

