<template>
    <div class="rider-income-check rider-container">
        <div class="rider-switch">
            <div class="tab active">{{$route.query.rname?$route.query.rname+'的':""}}收入明细</div>
            <div class="close-form-btn">
                <div class="text-blue point-style" @click='$router.go(-1)'>返回上一级</div>
            </div>
        </div>
        <div class="rider-search">
            <el-form :inline="true" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='流水号:'>
                            <el-input :size='$size' placeholder="请输入流水号" class="rider-input" v-model="formData.orderNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='订单ID:'>
                            <el-input :size='$size' placeholder="请输入订单ID" class="rider-input" v-model="formData.dispatchOrderNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='收入时间:'>
                            <el-date-picker :size='$size' class="rider-input input-350" type="datetimerange" align="center"
                                unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions2" v-model='time'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label=' '>
                            <el-button class="rider-btn" type='primary' :size='$size' @click='getList()'>搜索</el-button>
                            <el-button class="rider-btn cancel" :size='$size' @click='resetList()'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table fit :size='$size' :data='tableData' v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column label='流水号' min-width='120' prop='orderNo'></el-table-column>
                <el-table-column label='订单ID' min-width='120' prop='dispatchOrderNo'></el-table-column>
                <el-table-column label='收入配送费' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.amount|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label='账号余额' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.balance|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label='收入时间' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.updatedAt|formatTime}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :total='total' :form='formData' @page='getPage'></Pagination>
    </div>
</template>
<script>
import { datePickerOption } from "./../../../util/publicParams.js";
import moment from "moment";
export default {
    data() {
        return {
            pickerOptions2: datePickerOption,
            formData: {
                limit: 10,
                page: 1
            },
            tableData: [],
            total: 0,
            loading: false,
            time: []
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
            if (!this.$route.query.rid) {
                this.$message.error("没有骑手ID");
                this.$router.go(-1);
                return;
            }
            let data = { ...this.mFormData, riderId: this.$route.query.rid };
            console.log(
                "TCL: getList -> this.$route.query.rid",
                this.$route.query.rid
            );
            this.$http
                .get(this.$api.financeRiderDetail, data, true)
                .then(res => {
                    console.log("TCL: getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.$message.error("获取详情失败 错误码:" + err.code);
                    this.loading = false;
                });
        },
        getPage(val) {
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        resetList() {
            this.formData = {
                limit: 10,
                page: 1
            };
            this.time = [];
            this.getList();
        }
    }
};
</script>

