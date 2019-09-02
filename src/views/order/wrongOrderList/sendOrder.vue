<template>
    <div class="send-order rider-container">
        <div class="rider-switch">
            <div class="tab active">选择骑士</div>
            <div class="close-form-btn">
                <span class="text-blue point-style" @click='$router.go(-1)'>返回上一级</span>
            </div>
        </div>
        <div class="rider-search">
            <div class="tips">当前排序规则：按骑士到商户距离从近到远排序</div>
            <div class="line-flex-start">
                <el-input :size='$size' class="rider-input margin-right-20" v-model='key' placeholder="输入骑士ID / 手机号 / 姓名"></el-input>
                <el-button :size='$size' type='primary' class="rider-btn submit" @click='getList'>搜索</el-button>
                <el-button :size='$size' type='primary' class="rider-btn cancel" @click='key="",formData={limit:10,page:1};getList()'>重置</el-button>
            </div>
        </div>
        <div class="rider-table">
            <el-table :size='$size' :data='tableData' fit v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column label='序号' type='index' :index='function(index){return index+1+((formData.page-1)*formData.limit)}'
                    width='80'></el-table-column>
                <el-table-column label='骑士ID' prop='id' min-width='120'></el-table-column>
                <el-table-column label='手机号码' prop='phone' min-width='120'></el-table-column>
                <el-table-column label='待完成订单数' prop='todoOrderNum' min-width='120'></el-table-column>
                <el-table-column label='至商户距离(米)' prop='distance' min-width='120'></el-table-column>
                <el-table-column label='配送区域' prop='' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.cityCode|getCityName}} {{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                <el-table-column label='实名认证' prop='' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.idCardAuthStatus|AuthStatus}}
                    </template>
                </el-table-column>
                <el-table-column label='健康证认证' prop='' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.healthCardAuthStatus|AuthStatus}}
                    </template>
                </el-table-column>
                <el-table-column label='用户实名' prop='realName' min-width='120'></el-table-column>
                <el-table-column label='操作' min-width='120'>
                    <template slot-scope='scope'>
                        <el-button :size='$size' type="danger" @click='sendOrder(scope.row)'>派单</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :total='total' :form='formData' @page="getPage"></Pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: [],
            key: "",
            formData: {
                limit: 10,
                page: 1
            },
            total: 0,
            loading: false,
            submitLoading: false
        };
    },
    methods: {
        getList() {
            let query = this.$route.query;
            let orderNo = query.order;
            let address = query.address;
            if (!(orderNo && address)) {
                this.$message.error("无地址信息或者订单号");
                this.$router.go(-1);
                return;
            }
            this.loading = true;
            this.$http
                .get(
                    this.$api.orderErrorDealNearByRider,
                    {
                        key: this.key,
                        shopLocation: address,
                        limit: 10,
                        page: 1
                    },
                    true
                )
                .then(res => {
                    console.log("​getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    this.loading = false;
                });
        },
        sendOrder(rider) {
            let phone = rider.phone;
            let dUserId = rider.id;
            let realName = rider.realName;
            let location = rider.location;
            let orderNo = this.$route.query.order;
            let data = { phone, orderNo, realName, dUserId, location };
            this.$confirm("确定派单给该骑士吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(res => {
                    this.deal(data);
                })
                .catch(err => {
                    this.$message.warning("取消操作");
                });
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        deal(data) {
            if (this.submitLoading) return;
            this.submitLoading = true;
            this.$http
                .post(this.$api.orderErrorDeal, data, true)
                .then(res => {
                    this.$notify({
                        title: "提示",
                        message: "派单成功",
                        type: "success"
                    });
                    this.submitLoading = false;
                    this.$router.go(-1);
                })
                .catch(err => {
                    this.$notify({
                        title: "提示",
                        message: `派单失败 ${err.message}`,
                        type: "warning"
                    });
                    this.submitLoading = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.send-order {
    .tips {
        color: #fff;
        font-size: 12px;
        line-height: 50px;
        opacity: 0.8;
    }
}
</style>
