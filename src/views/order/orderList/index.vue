<template>
    <div class="order-list rider-container">
        <div class="rider-switch">
            <div class="tab" :class="{active:!isRiderOrderList}" @click='switchTab(false)' v-if='user.role[0].roleType!="SYSTEM"'>
                全部订单
            </div>
            <div class="tab" :class="{active:isRiderOrderList}" v-if='$route.query.name' @click='switchTab(true)'>
                {{riderID&&$route.query.name+"的订单列表"}}
            </div>
            <div class="close-form-btn" v-if='riderID'>
                <div class="text-blue point-style" @click='$router.go(-1)'>返回上一级</div>
            </div>
        </div>
        <div class="rider-search">
            <el-form label-width="100px" label-position="left" :model="formData" ref='formData' :inline="true"
                @keyup.enter.native='getList()'>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item prop='orderNo' label='订单号:'>
                            <el-input class="rider-input margin-right-20 input-250" placeholder="输入订单ID/子订单ID" :size="$size"
                                v-model='formData.orderNo'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='接单日期：' prop='time'>
                            <el-date-picker class="rider-input input-350" type="datetimerange" align="center"
                                unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions2" :size="$size" v-model='formData.time'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='异常等级：' prop='exceptionLevel'>
                            <el-select class="rider-input" :size="$size" v-model='formData.exceptionLevel'>
                                <el-option v-for='(item,index) in errorLevel' :key='index' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='订单状态：' prop='orderStatus'>
                            <el-select class="rider-input" :size='$size' v-model='formData.orderStatus'>
                                <el-option v-for='(item,index) in radioOrderStatus' :key='index' :value='item.value'
                                    :label='item.label'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='订单类型：' prop='xKModule'>
                            <el-select class="rider-input" :size='$size' v-model='formData.xKModule'>
                                <el-option v-for='(item,index) in radioProduct' :key='index' :value='item.value' :label='item.label'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='商品类型：' prop='orderType'>
                            <el-select class="rider-input" :size='$size' v-model='formData.orderType'>
                                <el-option v-for='(item,index) in radioOrder' :key='index' :value='item.value' :label='item.label'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label=' '>
                            <el-button :size="$size" class="rider-btn submit" @click='getList()'>搜索</el-button>
                            <el-button :size='$size' class='rider-btn cancel' type='warning' @click="resetForm()">重置</el-button>
                        </el-form-item>

                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table :size="$size" :data='tableData' fit v-loading='loading' element-loading-background="rgba(0,0,0,0.8)">
                <el-table-column label='订单ID' prop="orderNo" min-width='190'></el-table-column>
                <el-table-column label='异常等级' prop="exceptionLevel" min-width='85'></el-table-column>
                <el-table-column label='订单状态' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.orderStatus|OrderStatus}}
                    </template>
                </el-table-column>
                <el-table-column label='订单类型' min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.xkModule=='mall'?'自营类':"外卖类"}}
                    </template>
                </el-table-column>
                <el-table-column label='商品类型' min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.orderType=='not_food'?'非食品类':"食品类"}}
                    </template>
                </el-table-column>
                <el-table-column label='配送费' min-width='120' prop="orderAmount">
                    <template slot-scope='scope'>
                        {{scope.row.orderAmount|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label='所属区域' min-width='140'>
                    <template slot-scope='scope'>
                        {{scope.row.cityCode|getCityName}} {{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                <el-table-column label='接单时间' width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.receiveTime|formatTime}}
                    </template>
                </el-table-column>

                <el-table-column label='取货时间' width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.actualShopDuration|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='转单时间' width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.transTime|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='送达时间' width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.actualShopToDestDuration|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='取消时间' width='120'>
                    <template slot-scope='scope'>
                        <template v-if='scope.row.orderStatus=="order_cancel"'>
                            {{scope.row.updatedAt|formatTime}}
                        </template>
                        <template v-else>未取消</template>
                    </template>
                </el-table-column>
                <el-table-column label='操作' width='110' v-if='getOrderDetail'>
                    <template slot-scope='scope'>
                        <!-- <div class='text-blue point-style' @click='toDetail(scope.row.orderNo)'>查看详情</div> -->
                        <el-button type='primary' :size='$size' @click='toDetail(scope.row.orderNo)'>查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination @page='getPage' :form='formData' :total='total'></Pagination>
    </div>
</template>

<script>
// let radioOrderStatus = JSON.parse(localStorage.getItem("orderStatus"));
import ProvinceCascader from "./../../../components/ProvinceCascader";
import { datePickerOption } from "./../../../util/publicParams.js";
import { getSession } from "./../../../util/publicMehotds.js";
import moment from "moment";
import { getOrderDetail } from "./../../../menu/permission.js";
export default {
    components: {
        ProvinceCascader
    },
    data() {
        let radioOrder = JSON.parse(localStorage.getItem("orderType"));
        let radioProduct = JSON.parse(localStorage.getItem("XKModule"));
        // let productTypes = [
        //     { label: "食品类", value: 0 },
        //     { label: "非食品类", value: 1 },
        //     { label: "自营类", value: 2 },
        //     { label: "货物类", value: 3 }
        // ];
        let errorLevel = [
            { label: "全部", value: "" },
            { label: "0级", value: "0" },
            { label: "1级", value: "1" },
            { label: "2级", value: "2" }
        ];
        let radioOrderStatus = [
            {
                label: "全部",
                value: ""
            },
            {
                label: "待接单",
                value: "wait_rider"
            },
            {
                label: "待取货",
                value: "wait_pickup"
            },
            {
                label: "配送中",
                value: "rider_drivering"
            },
            {
                label: "已完成",
                value: "rider_arraive"
            },
            {
                label: "订单已取消",
                value: "order_cancel"
            },
            {
                label: "拒单",
                value: "rider_refuse"
            }
        ];
        return {
            errorLevel,
            // productTypes,
            radioOrderStatus,
            radioOrder,
            radioProduct,
            getOrderDetail,
            user: getSession("xk-user")
                ? JSON.parse(getSession("xk-user"))
                : {},
            // openForm: true,
            radioProductValue: "",
            radioOrderValue: "1",
            pickerOptions2: datePickerOption,
            city: [],
            isRiderOrderList: this.$route.query.id ? true : false,
            formData: {
                orderNo: "",
                // districtCode: [],
                time: [],
                orderType: "",
                exceptionLevel: "",
                xKModule: "",
                orderStatus: "",
                page: 1,
                limit: 10
            },
            tableData: [],
            status: "全部",
            total: 0,
            loading: false,
            oneUserLock: this.$route.query.id ? true : false
        };
    },

    computed: {
        mFormData() {
            let {
                orderNo,
                time,
                // districtCode,
                orderType,
                xKModule,
                orderStatus,
                exceptionLevel,
                page,
                limit
            } = this.formData;
            let startTime = "";
            let endTime = "";
            if (time[0]) {
                startTime = moment(time[0]).format("X");
                endTime = moment(time[1]).format("X");
            }
            return {
                orderNo,
                startTime,
                endTime,
                orderType,
                orderStatus,
                exceptionLevel,
                xKModule,
                page,
                limit
                // districtCode:
                //     this.formData.districtCode[
                //         this.formData.districtCode.length - 1
                //     ] || ""
            };
        },
        riderID() {
            if (this.$route.query.id) {
                return true;
            }
            return false;
        }
    },
    watch: {
        riderID(newV, oldV) {
            if (oldV && !newV) {
                this.getList();
            }
        }
    },
    methods: {
        switchTab(riderlist) {
            this.isRiderOrderList = riderlist;
            this.getList();
        },
        getList() {
            this.loading = true;
            let api = this.$api.orderGetList;
            let data = this.mFormData;
            if (this.$route.query.id && this.isRiderOrderList) {
                api = this.$api.userRiderOrderList;
                data.riderId = this.$route.query.id;
            } else {
                this.isRiderOrderList = false;
            }
            this.$http
                .get(api, data, true)
                .then(res => {
                    console.log("res: ", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                    this.oneUserLock = false;
                })
                .catch(err => {
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    this.loading = false;
                    console.log("err: ", err);
                    this.oneUserLock = false;
                });
        },
        // deal(id) {
        //     alert(id);
        // },
        // toDetail(id) {
        //     this.$router.push({
        //         name: "orderDetail",
        //         params: { orderId: id }
        //     });
        // },
        // handleAreaChange(e) {
        //     console.log(e);
        // },
        toDetail(id) {
            this.$router.push({ name: "orderDetail", query: { id: id } });
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            if (this.oneUserLock) {
                this.formData = {
                    orderNo: "",
                    time: [],
                    orderType: "",
                    exceptionLevel: "",
                    xKModule: "",
                    orderStatus: "",
                    page: 1,
                    limit: 10
                };
            }
            this.getList();
        },
        resetForm() {
            this.formData = {
                orderNo: "",
                districtCode: [],
                time: [],
                orderType: "",
                exceptionLevel: "",
                xKModule: "",
                orderStatus: "",
                page: 1,
                limit: 10
            };
            this.getList();
        }
    }
};
</script>
<style lang="scss">
.line-flex-start {
    flex-wrap: wrap;
}
</style>

