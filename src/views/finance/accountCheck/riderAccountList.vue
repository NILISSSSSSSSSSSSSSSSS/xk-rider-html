<template>
    <div class="rider-account-list rider-container">
        <div class="rider-switch">
            <div class="tab active">骑士账户列表</div>
        </div>
        <div class="rider-search">
            <el-form label-width="100px" :inline="true">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='骑士ID:'>
                            <el-input :size="$size" class="rider-input margin-right-20" v-model="formData.riderId"
                                placeholder="请输入骑士ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='骑士姓名:'>
                            <el-input :size="$size" class="rider-input margin-right-20" v-model="formData.realName"
                                placeholder="请输入骑士姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='手机号码:'>
                            <el-input :size="$size" class="rider-input margin-right-20" v-model="formData.phone"
                                placeholder="请输入骑士手机号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label=' '>
                            <el-button :size='$size' class="rider-btn submit" @click='getList()'>搜索</el-button>
                            <el-button :size='$size' class="rider-btn cancel" @click='resetList()'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>
        <div class="rider-table">
            <el-table fit :size='$size' :data="tableData" v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column label='序号' type='index' width='83' :index='function(index){return index+1+(formData.page-1)*formData.limit}'></el-table-column>
                <el-table-column label='骑士ID' prop='id' min-width='120'></el-table-column>
                <el-table-column label='骑士姓名' prop='realName' min-width='120'></el-table-column>
                <el-table-column label='手机号码' prop='phone' min-width='120'></el-table-column>
                <el-table-column label='账号余额' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.usable|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label='收入明细' min-width='120'>
                    <template slot-scope='scope'>
                        <el-button type='primary' :size='$size' @click='toDetail(scope.row)'>查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :form='formData' :total='total' @page='getPage'></Pagination>
    </div>
</template>
<script>
import { canUse } from "./../../../menu/permission.js";
export default {
    data() {
        return {
            loading: false,
            formData: {
                limit: 10,
                page: 1
            },
            total: 0,
            tableData: []
        };
    },
    methods: {
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.financeRiderList, this.formData, true)
                .then(res => {
                    console.log("TCL: getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    this.loading = false;
                });
        },
        resetList() {
            this.formData = { page: 1, limit: 10 };
            this.getList();
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        toDetail(rider) {
            if (!canUse("riderFinanceDetail")) return;
            this.$router.push({
                name: "riderIncomeCheck",
                query: { rid: rider.id, rname: rider.realName }
            });
        }
    }
};
</script>

