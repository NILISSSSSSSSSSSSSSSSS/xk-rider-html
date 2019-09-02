<template>
    <div class="refuse-order-check rider-container">
        <div class="rider-switch">
            <div class="tab" :class="{active:!formData.authStatus}" @click='switchTab("")'>全部订单</div>
            <div class="tab" :class="{active:formData.authStatus=='SUBMIT'}" @click='switchTab("SUBMIT")'>待审核</div>
            <div class="tab" :class="{active:formData.authStatus=='FAILED'}" @click='switchTab("FAILED")'>未通过</div>
            <div class="tab" :class="{active:formData.authStatus=='SUCCESS'}" @click='switchTab("SUCCESS")'>已通过</div>
            <!-- <div class="close-form-btn">
                <el-switch v-model='openForm'></el-switch>
            </div> -->
        </div>
        <keep-alive>
            <auto-deal :autoType='{type:"CANCEL_ORDER_AUTO_AUTH"}' v-if='formData.authStatus==""||formData.authStatus=="SUBMIT"'></auto-deal>
        </keep-alive>
        <div class="rider-search">
            <h1 class="title">订单列表</h1>
            <el-form label-width="100px" label-position="left" :inline="true" @submit.native.prevent
                @keyup.enter.native="getList()">
                <el-form-item label=" ">
                    <el-input class="rider-input margin-right-20 input-350" type='text' placeholder="输入订单ID/骑士手机号/骑士姓名"
                        :size='$size' v-model='formData.key'></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :size='$size' class="rider-btn submit" @click='getList()'>搜索</el-button>
                    <el-button :size='$size' class='rider-btn cancel' type='warning' @click='reset()'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table :size='$size' :data='tableData' v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column v-for='(item,index) in tableInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width='item.width'></el-table-column>
                <el-table-column label='审核状态' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.authStatus|authStatus}}
                    </template>
                </el-table-column>
                <el-table-column label='操作' min-width='170'>
                    <template slot-scope='scope'>
                        <el-button :size='$size' type='primary' v-if='scope.row.authStatus=="SUBMIT"' @click='getDetail(scope.row.id)'>审核</el-button>
                        <el-button :size='$size' @click='toDetail(scope.row.orderNo)'>查看订单详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <refuse-check :show.sync='openCheck' :detail="refuseDetail" @success='getList()'></refuse-check>
        <Pagination :total='total' :form='formData' @page='getPage'></Pagination>
    </div>
</template>
<script>
import RefuseCheck from "../../../components/order/RefuseCheck";
import AutoDeal from "./../../../components/AutoDeal";
// import { datePickerOption } from "../../../util/publicParams.js";
import { refuseOrderDetail, canUse } from "./../../../menu/permission.js";
export default {
    components: {
        RefuseCheck,
        AutoDeal
    },
    data() {
        let tableInfo = [
            { label: "订单ID", prop: "orderNo", width: "120" },
            { label: "骑士姓名", prop: "realName", width: "120" },
            { label: "联系方式", prop: "phone", width: "120" }
        ];
        return {
            refuseOrderDetail,
            tableInfo,
            openForm: true,
            openCheck: false,
            time: "",
            city: [],
            formData: {
                page: 1,
                limit: 10,
                authStatus: ""
            },
            autoForm: { choose: "0" },
            // pickerOptions2: datePickerOption,
            tableData: [],
            total: 0,
            loading: false,
            refuseDetail: {}
        };
    },
    methods: {
        switchTab(name) {
            let data = {
                ...this.formData,
                authStatus: name,
                page: 1,
                limit: 10
            };
            this.formData = data;
            this.getList();
        },
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.orderRefuseList, this.formData, true)
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
        reset() {
            this.formData = { authStatus: "", page: 1, limit: 10 };
            this.getList();
        },
        toDetail(id) {
            // this.$router.push({
            //     path: "/refuseOrderDetail",
            //     query: { id: id }
            // });
            if (!canUse("refuseOrderDetail")) return;
            this.$router.push({
                path: "/orderDetail",
                query: { id: id }
            });
        },
        getDetail(val) {
            if (!canUse("refuseReasonDetail")) return;
            if (val) {
                this.$http
                    .get(this.$api.orderRefuseDetail, { id: val }, true)
                    .then(res => {
                        console.log("​getDetail -> res", res);
                        this.refuseDetail = res;
                        if (res) {
                            this.openCheck = true;
                        }
                    })
                    .catch(err => {
                        this.$message.error("获取详情失败 ", err.code);
                    });
            }
        },
        getPage(val) {
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        }
    }
};
</script>
