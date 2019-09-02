<template>
    <div class="income-detail rider-container">
        <div class="rider-switch">
            <div class="tab active">支出明细</div>
        </div>
        <div class="rider-search">
            <el-form label-width="100px" label-position="left" :inline="true">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='流水号:'>
                            <el-input :size='$size' class="rider-input margin-right-20 input-250" v-model='formData.orderNo'
                                placeholder="输入流水号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='配送订单号:'>
                            <el-input :size='$size' class="rider-input margin-right-20 input-250" v-model='formData.dispatchOrderNo'
                                placeholder="输入配送订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='交易时间:'>
                            <el-date-picker class="rider-input input-350" v-model="time" type="daterange" align="right"
                                unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions2" :size='$size'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- <el-col :span="8">
                        <el-form-item label='来源:'>
                            <el-select class="rider-input input-250" :size='$size' v-model='formData.xKModule'>
                                <el-option v-for='item in XKmodule' :key='item.value' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="8">
                        <el-form-item label='订单类型:'>
                            <el-select class="rider-input input-250" :size='$size' v-model='formData.orderType'>
                                <el-option v-for='item in orderType' :key='item.value' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- </el-row>
                <el-row> -->
                    <el-col :span='8'>
                        <el-form-item label=''>
                            <el-button :size='$size' class="rider-btn submit" @click='getList()'>搜索</el-button>
                            <el-button :size='$size' class="rider-btn cancel" @click='resetList()'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>
        <div class="rider-table">
            <el-table :size='$size' fit :data='tableData' v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column label='流水号' prop='orderNo' min-width='130'></el-table-column>
                <el-table-column label='配送订单号' prop='dispatchOrderNo' min-width='130'></el-table-column>
                <el-table-column label='订单类型' prop='dispatchOrderNo' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.orderType=='food'?"食品类":"非食品类"}}
                    </template>
                </el-table-column>
                <el-table-column label='所属区域' prop='orderNo' min-width='130'>
                    <template slot-scope='scope'>
                        {{scope.row.provinceCode|getProvinceName}}-{{scope.row.cityCode|getCityName}}-{{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                //TODO 修改
                <el-table-column label='原配送费' min-width='100'>
                    <template slot-scope='scope'>{{scope.row.amount|formatPrice}}</template>
                </el-table-column>
                <el-table-column label='平台抽成金额' min-width='100'>
                    <template slot-scope='scope'>{{scope.row.drawOutAmount|formatPrice}}</template>
                </el-table-column>
                <el-table-column label='平台支出金额' min-width='100'>
                    <template slot-scope='scope'>{{(scope.row.amount-scope.row.drawOutAmount)|formatPrice}}</template>
                </el-table-column>
                <el-table-column label='交易时间' min-width='120'>
                    <template slot-scope='scope'>{{scope.row.tradeAt|formatTime}}</template>
                </el-table-column>
                //TODO 增加
                <el-table-column label='操作' min-width='150'>
                    <template slot-scope='scope'>
                        <el-button type='primary' :size='$size' @click='toDetail(scope.row.dispatchOrderNo)'>查看订单</el-button>
                        <el-button type='primary' :size='$size' :loading="transactionLock" @click='toTransaction(scope.row.dispatchOrderNo)'>交易详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Transaction :show.sync='openTransaction' :detail='transactionDetail'></Transaction>
        <Pagination :total='total' :form='formData' @page='getPage'></Pagination>
    </div>
</template>
<script>
import Transaction from "./../../../components/finance/TransactionDetail.vue";
import { datePickerOption } from "./../../../util/publicParams.js";
import { getSession } from "./../../../util/publicMehotds.js";
import mixin from "./incomeMixin.js";
import moment from "moment";
export default {
    mixins: [mixin],
    components: {
        Transaction
    },
    data() {
        return {
            XKmodule: JSON.parse(localStorage.getItem("XKModule")),
            orderType: JSON.parse(localStorage.getItem("orderType")),
            formData: { page: 1, limit: 10 },
            time: [],
            areaValue: "1",
            pickerOptions2: datePickerOption,
            loading: false,
            total: 0,
            tableData: [],
            openTransaction: true
        };
    },
    computed: {
        mFormData() {
            let startTime = "";
            let endTime = "";
            if (this.time.length == 2) {
                startTime = moment(this.time[0]).format("X");
                endTime = moment(this.time[1]).format("X");
            }
            return { ...this.formData, startTime, endTime };
        }
    },
    methods: {
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.financePlatformList, this.mFormData, true)
                .then(res => {
                    console.log("TCL: getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.$message.error("暂时无法获取列表 错误码:" + err.code);
                    this.loading = false;
                });
        },
        getPage(val) {
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        resetList() {
            this.formData = { limit: 10, page: 1 };
            this.time = [];
            this.getList();
        }
    }
};
</script>

