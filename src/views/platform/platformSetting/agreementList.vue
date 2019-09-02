<template>
    <div class="agreement-list rider-container">
        <div class="rider-switch">
            <div class="tab active">平台协议列表</div>
            <!-- <div class="close-form-btn">
                <el-button :size='$size' type='primary' @click='$router.push({name:"agreementSetting"})'>新增平台协议</el-button>
            </div> -->
        </div>
        <div class="rider-table">
            <el-table fit v-loading="loading" :data='tableData' element-loading-background="rgba(0,0,0,0.8)" :size='$size'
                :default-sort="{prop: 'number', order: 'ascending'}">
                <el-table-column label='编号' prop='number'></el-table-column>
                <el-table-column label='协议标题' prop='title'></el-table-column>
                <el-table-column label='操作'>
                    <template slot-scope='scope'>
                        <el-button :size='$size' type='' @click='detailA(scope.row.number)'>查看</el-button>
                        <el-button :size='$size' type='primary' @click='modifyA(scope.row.number)'>修改</el-button>
                        <!-- <el-button :size='$size' type='danger' @click='deleteA(scope.row.id)'>删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :total='total' :form='formData' @page='getPage'></Pagination>
        <agreement-detail :show.sync='showDetail' :form='detailContent'></agreement-detail>
    </div>
</template>
<script>
import { saveSession } from "./../../../util/publicMehotds.js";
import { mapMutations } from "vuex";
import AgreementDetail from "./../../../components/platform/AgreementDetail";
import { canUse } from "./../../../menu/permission.js";
export default {
    components: {
        AgreementDetail
    },
    data() {
        return {
            loading: false,
            formData: { page: 1, limit: 100 },
            tableData: [],
            total: 0,
            showDetail: false,
            detailContent: {}
        };
    },
    methods: {
        ...mapMutations({
            saveList: "agreement/saveList"
        }),
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.platformAgreementList, this.formData, true)
                .then(res => {
                    console.log("​getList -> res", res);
                    this.tableData = res.data;
                    this.saveList(res.data);
                    saveSession("agreement_list", JSON.stringify(res.data));
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    console.log("​getList -> err", err);
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    this.loading = false;
                });
        },
        detailA(number) {
            if (this.tableData.length > 0) {
                for (let i of this.tableData) {
                    if (i.number == number) {
                        this.detailContent = i;
                        this.showDetail = true;
                    }
                }
            }
        },
        // deleteA(id) {
        //     this.$confirm("确认删除", "确认信息", {
        //         distinguishCancelAndClose: true,
        //         confirmButtonText: "删除",
        //         cancelButtonText: "取消",
        //         type: "warning"
        //     })
        //         .then(res => {
        //             console.log("删除");
        //         })
        //         .catch(err => {
        //             console.log("取消");
        //         });
        // },
        modifyA(number) {
            if (!canUse("agreementSetting")) return;
            this.$router.push({
                name: "agreementSetting",
                query: { num: number, type: "write" }
            });
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        }
    }
};
</script>

