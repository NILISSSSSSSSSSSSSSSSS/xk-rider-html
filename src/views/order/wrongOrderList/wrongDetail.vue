<template>
    <div class="wrong-detail rider-container">
        <div class="rider-switch">
            <div class="tab active">已处理</div>
            <div class="close-form-btn">
                <span class="text-blue point-style" @click='$router.go(-1)'>返回上一级</span>
            </div>
        </div>
        <div class="rider-table">
            <h1 class="title">订单详情</h1>
            <el-table :size='$size' :data='tableData'>
                <el-table-column label='订单ID' prop='orderNo' min-width='120'></el-table-column>
                <el-table-column label='下单时间' prop='createdAt' min-width='120'>
                    <template slot-scope='scope'>{{scope.row.createdAt|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='配送金额' prop='orderAmount' min-width='120'>
                    <template slot-scope='scope'>{{scope.row.orderAmount|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label='异常等级' prop='exceptionLevel' min-width='120'></el-table-column>
                <el-table-column label='支付方式' prop='payChannel' min-width='120'></el-table-column>
                <el-table-column label='所属区域' prop='orderNo' min-width='120'>
                    <template slot-scope='scope'>{{scope.row.provinceCode|getProvinceName}}
                        {{scope.row.cityCode|getCityName}} {{scope.row.districtCode|getDistrictName}}</template>
                </el-table-column>
                <el-table-column label='预计配送时间' prop='planShopToDestDuration' min-width='120'>
                    <template slot-scope='scope'>{{scope.row.planShopToDestDuration|formatTime}}
                    </template>
                </el-table-column>
            </el-table>
            <!-- <h1 class="title">商户信息</h1>
            <el-table :size='$size' :data='merchant'    >
                <el-table-column label='商户名称' prop='merchantName' min-width='120'></el-table-column>
                <el-table-column label='取货地址' prop='shopAddress' min-width='120'></el-table-column>
                <el-table-column label='商户负责人' prop='responsibleName' min-width='120'></el-table-column>
                <el-table-column label='联系方式' prop='merchantPhone' min-width='120'></el-table-column>
                <el-table-column label='备注信息' prop='merchantRemark' min-width='120'></el-table-column>
            </el-table> -->
            <h1 class="title">取货信息</h1>
            <el-table :data='merchant' fit :size='$size'>
                <el-table-column label='取货地名称' prop='shopName' min-width='120'></el-table-column>
                <el-table-column label='取货地址' prop='shopAddress' min-width='120'></el-table-column>
                <el-table-column label='取货联系人' prop='merchantName' min-width='120'></el-table-column>
                <el-table-column label='联系方式' prop='merchantPhone' min-width='120'></el-table-column>
                <el-table-column label='备注信息' prop='merchantRemark' min-width='120'></el-table-column>
            </el-table>
            <h1 class="title">收货信息</h1>
            <el-table :size='$size' :data='user'>
                <el-table-column label='用户名' prop='userName' min-width='120'></el-table-column>
                <el-table-column label='配送地址' prop='userAddress' min-width='120'></el-table-column>
                <el-table-column label='联系方式' prop='userPhone' min-width='120'></el-table-column>
                <el-table-column label='备注信息' prop='userRemark' min-width='120'></el-table-column>
            </el-table>
            <h1 class="title">商品信息</h1>
            <el-table :data='product' fit :size='$size'>
                <el-table-column label='商品ID' prop='goodsId' min-width='120'></el-table-column>
                <!-- <el-table-column label='防伪编码' prop='securityCode' min-width='120'></el-table-column> -->
                <!-- <el-table-column label='商品图片' prop='skuUrl' min-width='120'>
                    <template slot-scope='scope'>
                        <img class="inside-img-big" @click='$viewImage(scope.row.skuUrl)' :src="scope.row.skuUrl" alt="">
                    </template>
                </el-table-column> -->
                <el-table-column label='商品名称' prop='goodsName' min-width='120'></el-table-column>
                <el-table-column label='商品类型' prop='goodsType' min-width='120'></el-table-column>
                <el-table-column label='数量' prop='goodsNum' min-width='120'></el-table-column>
                <el-table-column label='规格' prop='skuName' min-width='120'></el-table-column>
                <el-table-column label='品牌' prop='brand' min-width='120'></el-table-column>
                <el-table-column label='重量' prop='weight' min-width='120'></el-table-column>
                <el-table-column label='单价' prop='platformPrice' min-width='120'></el-table-column>
            </el-table>
        </div>
        <!-- <el-amap class="map" :plugin='plugin' style='display:none'></el-amap> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            merchant: [],
            user: [],
            product: [],
            tableData: []
        };
    },
    created() {
        this.getDetail();
    },

    methods: {
        getDetail() {
            if (!this.$route.query.order) {
                this.$message.error("无订单号");
                this.$router.go(-1);
                return;
            }
            let data = { orderNo: this.$route.query.order };
            this.$http
                .get(this.$api.orderErrorDetail, data, true)
                .then(res => {
                    console.log("​getDetail -> res", res);
                    this.tableData = [res];
                    this.merchant = [res.merchantInfo];
                    this.user = [res.userInfo];
                    this.product = res.goodsInfo;
                })
                .catch(err => {
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    this.$router.go(-1);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.wrong-detail {
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
</style>
