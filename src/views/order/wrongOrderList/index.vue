<template>
    <div class="refuse-order-check rider-container">
        <div class="rider-switch">
            <div class="tab" :class="{active:formData.exceptionLevel==1}" @click='switchTab(1)'>一级异常订单</div>
            <div class="tab" :class="{active:formData.exceptionLevel==2}" @click='switchTab(2)'>二级异常订单</div>
            <!-- <div class="close-form-btn">
                <el-switch v-model='openForm'></el-switch>
            </div> -->
        </div>
        <!-- <auto-deal :autoType='{type:"ONE_EXCEPTION_ORDER_AUTO_DISPATCH"}' v-if='formData.exceptionLevel==1' :key='formData.exceptionLevel'></auto-deal> -->
        <keep-alive>
            <auto-deal :autoType='{type:"TWO_EXCEPTION_ORDER_AUTO_DISPATCH"}' v-if='formData.exceptionLevel==2' :key='formData.exceptionLevel'></auto-deal>
        </keep-alive>
        <div class="rider-search">
            <h1 class="title">异常订单列表</h1>
            <el-form label-width="100px" label-position="center" ref='formData' :inline="true" :model='formData'>
                <el-row>
                    <el-col :span="8">
                        <el-form-item prop='orderNo' label='订单ID:'>
                            <el-input :size='$size' placeholder="输入订单ID/子订单ID" class='rider-input input-250 margin-right-20'
                                v-model='formData.orderNo'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='派单日期：'>
                            <el-date-picker class="rider-input input-350" type="datetimerange" align="right"
                                unlink-panels v-model='formTime' range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" :picker-options="pickerOptions2" :size="$size"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='所属区域：'>
                            <province-cascader class="rider-input" v-model='area'></province-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='异常处理：' prop='isDeal'>
                            <el-select :size='$size' class="rider-input" v-model='formData.isDeal'>
                                <el-option v-for='(item,index) in errorTypes' :key='index' :value='item.value' :label='item.label'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='订单类型:' prop='orderType'>
                            <el-select :size='$size' class="rider-input" v-model='formData.orderType'>
                                <el-option v-for='(item,index) in productTypes' :key='index' :value='item.value' :label='item.label'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='商品类型:' prop='xkModule'>
                            <el-select :size='$size' class="rider-input" v-model='formData.xkModule'>
                                <el-option v-for='(item,index) in XKModule' :key='index' :value='item.value' :label='item.label'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label=' '>
                            <el-button :size='$size' type='primary' class='rider-btn' @click='getErrorList'>搜索</el-button>
                            <el-button :size='$size' class='rider-btn cancel' type='warning' @click="resetForm('formData')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>
        <div class="rider-table">
            <el-table :size='$size' :data='tableData' v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column label='订单ID' prop='orderNo' min-width='180'></el-table-column>
                <el-table-column label='异常等级' prop='exceptionLevel' min-width='80'></el-table-column>
                <el-table-column label='派单时间' prop='createdAt' width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.createdAt|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='订单类型' prop='orderType' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.orderType=='food'?"食品类":"非食品类"}}
                    </template>
                </el-table-column>
                <el-table-column label='商品类型' prop='xkModule' min-width='140'>
                    <template slot-scope='scope'>
                        {{scope.row.xkModule=='shop'?"商圈商品(外卖)":"自营"}}
                    </template>
                </el-table-column>
                <el-table-column label='配送费' prop='orderAmount' min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.orderAmount|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label='所属区域' prop='orderNo' min-width='130'>
                    <template slot-scope='scope'>
                        {{scope.row.cityCode|getCityName}} {{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                <el-table-column label='取货地址' prop='shopAddress' min-width='150'></el-table-column>
                <el-table-column label='配送地址' prop='userAddress' min-width='150'></el-table-column>
                <el-table-column label='异常处理' prop='isDeal' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.isDeal?"已处理":"未处理"}}
                    </template>
                </el-table-column>
                <el-table-column label='操作' width='170'>
                    <template slot-scope='scope'>
                        <div>
                            <el-button :size='$size' type='primary' @click='toOrderDetail(scope.row.orderNo)'>查看</el-button>
                            <el-button :size='$size' type='danger' @click='toSendOrder(scope.row)'>派单</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination @page='getPage' :form='formData' :total="total"></Pagination>
    </div>
</template>
<script>
import moment from "moment";
import ProvinceCascader from "./../../../components/ProvinceCascader";
import AutoDeal from "./../../../components/AutoDeal";
import { datePickerOption } from "./../../../util/publicParams.js";
import { getSession } from "./../../../util/publicMehotds.js";
import { sendOrder, getErrorOrderDetail } from "./../../../menu/permission.js";
export default {
    components: {
        ProvinceCascader,
        AutoDeal
    },
    data() {
        let productTypes = JSON.parse(localStorage.getItem("orderType"));
        let XKModule = JSON.parse(localStorage.getItem("XKModule"));
        let errorTypes = [
            { label: "全部", value: "" },
            { label: "待处理", value: 0 },
            { label: "已处理", value: 1 }
        ];
        return {
            productTypes,
            errorTypes,
            XKModule,
            sendOrder,
            getErrorOrderDetail,
            radioProductValue: 0,
            radioErrorValue: 0,
            // orderType: productTypes,
            user: getSession("xk-user")
                ? JSON.parse(getSession("xk-user"))
                : {},
            openForm: true,
            autoForm: { choose: "1" },
            formData: {
                orderNo: "",
                orderType: "",
                exceptionLevel: "1",
                xkModule: "",
                isDeal: "",
                limit: 10,
                page: 1
            },
            formTime: [],
            area: [],
            total: 0,
            tableData: [],
            pickerOptions2: datePickerOption,
            loading: false
        };
    },
    computed: {
        // roleType() {
        //     if (!this.user.role) return "";
        //     return this.user.role[0].roleType;
        // },
        // exceptionLevel() {
        //     return this.roleType == "SYSTEM" ? 2 : 1;
        // },
        mFormData() {
            let times = {
                startTime: "",
                endTime: ""
            };
            if (this.formTime[0]) {
                times = {
                    startTime: moment(this.formTime[0]).format("X"),
                    endTime: moment(this.formTime[1]).format("X")
                };
            }
            let area = {};
            if (this.area.length == 3) {
                area.districtCode = this.area[2];
            }
            return {
                ...this.formData,
                ...times,
                ...area
            };
        }
    },
    methods: {
        switchTab(l) {
            this.formData.exceptionLevel = l;
            this.getErrorList();
        },
        getErrorList() {
            this.loading = true;
            this.$http
                .get(this.$api.orderErrorList, this.mFormData, true)
                .then(res => {
                    console.log("​getErrorList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    console.log("​getErrorList -> err", err);
                });
        },
        toOrderDetail(orderNo) {
            if (!this.getErrorOrderDetail) {
                this.$message.error("没有查看详情权限");
                return;
            }
            this.$router.push({
                path: "/wrongDetail",
                query: { order: orderNo }
            });
        },
        toSendOrder(item) {
            if (!this.sendOrder) {
                this.$message.error("没有派单权限");
                return;
            }
            // if(this.formData.exceptionLevel==1&&)
            let address = item.shopLocation;
            let orderNo = item.orderNo;
            this.$router.push({
                path: "/sendOrder",
                query: { order: orderNo, address: address }
            });
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getErrorList();
        },
        resetForm(formName) {
            let form = {
                orderNo: "",
                orderType: "",
                // exceptionLevel: "1",
                xkModule: "",
                isDeal: "",
                limit: 10,
                page: 1
            };
            this.formData = { ...this.formData, ...form };
            this.formTime = [];
            this.area = [];
            this.getErrorList();
        }
    }
};
</script>
