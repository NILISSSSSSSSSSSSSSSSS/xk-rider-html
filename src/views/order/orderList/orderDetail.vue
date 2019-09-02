<template>
    <div class="order-detail rider-container">
        <div class="rider-switch">
            <div class="tab active" v-if='orderData[0]'>{{orderData[0].orderStatus|orderStatus}}</div>
            <div class="tab active" v-else>{{$route.query.id}} 订单详情</div>
            <div class="close-form-btn">
                <div class="text-blue" @click='$router.go(-1)'>返回上一级</div>
            </div>
        </div>
        <div class="rider-table">
            <h1 class="title">订单信息</h1>
            <el-table :data='orderData' fit :size='$size'>
                <el-table-column label='订单ID' prop='orderNo' min-width='110'></el-table-column>
                <el-table-column label='订单状态' prop='orderStatus' min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.orderStatus|orderStatus}}
                    </template>
                </el-table-column>
                <el-table-column label='订单类型' prop='orderType' min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.orderType=='food'?"食品类":"非食品类"}}
                    </template>
                </el-table-column>
                <el-table-column label='所属区域' prop='districtCode' min-width='130'>
                    <template slot-scope='scope'>
                        {{scope.row.provinceCode|getProvinceName}} {{scope.row.cityCode|getCityName}}
                        {{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                <el-table-column label='派单时间' prop='createdAt' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.createdAt|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='配送金额' prop='orderAmount' min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.orderAmount|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label='异常等级' prop='exceptionLevel' min-width='90'></el-table-column>
                <el-table-column label='支付方式' prop='payChannel' min-width='160'>
                    <!-- payChannel可能有多个支付方式
                        数组对象,对象包含"payChannel"字段,判断是否包含该字符串
                        无支付方式时返回null
                    -->
                    <template slot-scope='scope' v-if='scope.row.payChannel&&scope.row.payChannel.includes("payChannel")'>
                        <div v-for='(item,index) in JSON.parse(scope.row.payChannel)' :key='index'>{{index>0?"+":""}}{{item.payChannel|getPayChannel}}</div>
                        <!-- {{JSON.parse(scope.row.payChannel)[0].payChannel|getPayChannel}} -->
                    </template>
                </el-table-column>
                <el-table-column label='预计配送时间' prop='planShopToDestDuration' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.planShopToDestDuration|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='完成时间' prop='actualShopToDestDuration' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.actualShopToDestDuration|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='用户评分' prop='' min-width='100'></el-table-column>
                <el-table-column label='超时时长' prop='' min-width='130'></el-table-column>
                <el-table-column label='总重量' prop='totalWeight' min-width='90'></el-table-column>
                <el-table-column label='转单次数' prop='transOrderNum' min-width='100'></el-table-column>
            </el-table>

            <h1 class="title" v-if='refuseInfo[0]'>申请信息</h1>
            <el-table v-if='refuseInfo[0]' :data='refuseInfo' fit :size='$size'>
                <el-table-column label='取消原因' prop='message' min-width='120'></el-table-column>
                <el-table-column label='上传图片' prop='id' min-width='120'>
                    <template slot-scope='scope'>
                        <div class="uploadImg">
                            <img class="inside-img-small" v-for='(item,index) in scope.row.imgUrls' :key='index' :src="item"
                                @click='$viewImage(item)' alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label='描述' prop='remark' min-width='120'>
                    <template slot-scope='scope'>
                        <pre>{{scope.row.remark}}</pre>
                    </template>
                </el-table-column>
            </el-table>

            <h1 class="title">配送信息</h1>
            <el-table :data='subOrderData' fit :size='$size'>
                <el-table-column label='子订单ID' prop='subOrderNo' min-width='150'></el-table-column>
                <el-table-column label='骑士名称' prop='realName' min-width='100'></el-table-column>
                <el-table-column label='骑士ID' prop='id' min-width='170'></el-table-column>
                <el-table-column label='骑士手机号' prop='phone' min-width='120'></el-table-column>
                <el-table-column label='配送金额' prop='orderCommission' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.orderCommission|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label="接单时间" prop='receiveOrderTime' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.receiveOrderTime|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="取货时间" prop='pickupTime' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.pickupTime|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="转单时间" prop='transOrderTime' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.transOrderTime|formatTime}}
                    </template>
                </el-table-column>
            </el-table>

            <h1 class="title">取货信息</h1>
            <el-table :data='merchantInfo' fit :size='$size'>
                <el-table-column label='取货地名称' prop='shopName' min-width='120'></el-table-column>
                <el-table-column label='取货地址' prop='shopAddress' min-width='120'></el-table-column>
                <el-table-column label='取货联系人' prop='merchantName' min-width='120'></el-table-column>
                <el-table-column label='联系方式' prop='merchantPhone' min-width='120'></el-table-column>
                <el-table-column label='备注信息' prop='merchantRemark' min-width='120'></el-table-column>
            </el-table>

            <h1 class="title">收货信息</h1>
            <el-table :data='userInfo' fit :size='$size'>
                <el-table-column label='用户名' prop='userName' min-width='120'></el-table-column>
                <el-table-column label='配送地址' prop='userAddress' min-width='120'></el-table-column>
                <el-table-column label='联系方式' prop='userPhone' min-width='120'></el-table-column>
                <el-table-column label='备注信息' prop='userRemark' min-width='120'></el-table-column>
            </el-table>

            <h1 class="title">商品信息</h1>
            <el-table :data='goodsInfo' fit :size='$size'>
                <el-table-column label='商品ID' prop='goodsId' min-width='140'></el-table-column>
                <!-- <el-table-column label='防伪编码' prop='securityCode' min-width='120'></el-table-column> -->
                <!-- <el-table-column label='商品图片' prop='skuUrl' min-width='120'>
                    <template slot-scope='scope'>
                        <img class="inside-img-big" @click='$viewImage(scope.row.skuUrl)' :src="scope.row.skuUrl" alt="">
                    </template>
                </el-table-column> -->
                <el-table-column label='商品名称' prop='goodsName' min-width='120'></el-table-column>
                <el-table-column label='商品类型' prop='goodsType' min-width='120'></el-table-column>
                <el-table-column label='数量' prop='goodsNum' min-width='80'></el-table-column>
                <el-table-column label='规格' prop='skuName' min-width='120'></el-table-column>
                <el-table-column label='品牌' prop='brand' min-width='100'></el-table-column>
                <el-table-column label='重量' prop='weight' min-width='80'></el-table-column>
                <el-table-column label='单价' prop='platformPrice' min-width='120'>
                    <template slot-scope='scope'>{{scope.row.platformPrice|formatPrice}}</template>
                </el-table-column>
            </el-table>

            <h1 class="title" v-if="!['rider_refuse','wait_rider'].includes(orderData[0].orderStatus)">财务明细</h1>
            <el-table :data='income' fit :size='$size' v-if="!['rider_refuse','wait_rider'].includes(orderData[0].orderStatus)">
                <el-table-column label='原配送费' min-width='140'>
                    <template slot-scope='scope'>{{scope.row.amount|formatPrice}}</template>
                </el-table-column>
                <el-table-column label='平台收入金额' min-width='140'>
                    <template slot-scope='scope'>{{(scope.row.amount-scope.row.extraAmount)|formatPrice}}</template>
                </el-table-column>
                <el-table-column label='补贴金额' min-width='120'>
                    <template slot-scope='scope'>{{scope.row.extraAmount|formatPrice}}</template>
                </el-table-column>
                <el-table-column label='平台抽成金额' min-width='120'>
                    <template slot-scope='scope'>{{scope.row.drawOutAmount|formatPrice}}</template>
                </el-table-column>
                <el-table-column label='平台支出金额' min-width='80'>
                    <template slot-scope='scope'>{{(scope.row.amount-scope.row.drawOutAmount)|formatPrice}}</template>
                </el-table-column>
                <el-table-column label='净收入' min-width='120'>
                    <template slot-scope='scope'>{{(scope.row.drawOutAmount-scope.row.extraAmount)|formatPrice}}</template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { payChannel } from "./../../../util/publicParams.js";
export default {
    data() {
        return {
            orderData: [],
            subOrderData: [],
            refuseInfo: [],
            userInfo: [],
            merchantInfo: [],
            goodsInfo: [],
            income: []
        };
    },
    created() {
        console.log(this.$route.query.id);
        this.getDetail();
    },
    filters: {
        getPayChannel(val) {
            for (let item of payChannel) {
                if (item.key == val) {
                    return item.value;
                }
            }
        }
    },
    methods: {
        getDetail() {
            let data = { orderNo: this.$route.query.id };
            this.$http
                .get(this.$api.orderDetail, data, true)
                .then(res => {
                    console.log("​getDetail -> res", res);
                    this.orderData = [res];
                    this.subOrderData = res.subOrderInfo;
                    this.refuseInfo = [res.refuseInfo];
                    this.userInfo = [res.userInfo];
                    this.merchantInfo = [res.merchantInfo];
                    this.goodsInfo = res.goodsInfo;
                    this.income = [res.riderAccBillData];
                })
                .catch(err => {
                    console.log("​getDetail -> err", err);
                    this.$message.error("暂时无法获取详情 错误码:" + err.code);
                    this.$router.go(-1);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.order-detail {
    width: 100%;
    .title {
        color: #fff;
        line-height: 70px;
        padding-left: 20px;
    }
}
.inside-img-small {
    width: 18%;
}
.inside-img-big {
    width: 50%;
}
.uploadImg {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
pre {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    white-space: pre-wrap;
    display: block;
    padding: 0 30px;
    text-align: left;
}
</style>
