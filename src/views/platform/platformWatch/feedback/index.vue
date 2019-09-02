
<template>
    <div class="feedback rider-container">
        <div class="rider-switch">
            <div class="tab active">全部反馈</div>
        </div>
        <div class="rider-search">
            <el-form class="line-flex-start" label-width="100px" :inline="true" :model='formData'>
                <el-form-item label='反馈ID:'>
                    <el-input :size='$size' class="rider-input margin-right-20" placeholder="输入反馈ID" v-model='formData.id'></el-input>
                </el-form-item>
                <el-form-item label='骑手ID:'>
                    <el-input :size='$size' class="rider-input margin-right-20" placeholder="输入骑手ID" v-model='formData.riderId'></el-input>
                </el-form-item>

                <el-form-item label='反馈日期 :'>
                    <el-date-picker class="rider-input input-350 margin-right-20" type="datetimerange" align="right"
                        unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        :picker-options="pickerOptions2" :size="$size" v-model='formData.time'>
                    </el-date-picker>
                </el-form-item>
                <el-button :size='$size' class="rider-btn submit" @click='getList()'>搜索</el-button>
                <el-button :size='$size' class="rider-btn cancel" @click='resetForm()'>重置</el-button>
            </el-form>
        </div>
        <div class="rider-table">
            <div class="rider-table-btn-group">
                <el-button class="rider-btn" type='danger' :disabled="chooseList.length==0" @click='deleteItems()'>批量删除</el-button>
                <span>已选中 <span class="text-blue">{{chooseList.length}}</span> 个反馈</span>
            </div>
            <el-table fit :size='$size' :data='tableData' v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'
                @selection-change="handleSelectionChange">
                <el-table-column type='selection' width='82'></el-table-column>
                <el-table-column v-for='(item,index) in tableInfo' :key='index' :label='item.label' :prop='item.prop'
                    :width='item.width'></el-table-column>
                <el-table-column label='反馈时间' width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.createdAt|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='反馈详情' prop='content'>
                    <template slot-scope='scope'>
                        <pre>{{scope.row.content}}</pre>
                    </template>
                </el-table-column>
                <el-table-column label='操作' fixed='right' width='120'>
                    <template slot-scope='scope'>
                        <el-button :size='$size' type='danger' @click='deleteOne(scope.row.id)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :form="formData" :total='total' @page='getPage'></Pagination>
    </div>
</template>

<script>
import { datePickerOption } from "./../../../../util/publicParams.js";
import { canUse } from "./../../../../menu/permission.js";
import moment from "moment";
export default {
    data() {
        let tableInfo = [
            { label: "反馈编号", prop: "id", width: "160" },
            { label: "骑士ID", prop: "userId", width: "160" },
            { label: "骑士姓名", prop: "realName", width: "130" },
            { label: "手机号码", prop: "phone", width: "150" }
            // { label: "反馈时间", prop: "id", width: "120" },
            // { label: "反馈原因", prop: "content", width: "200" }
        ];
        return {
            tableInfo,
            formData: {
                id: "",
                riderId: "",
                time: [],
                limit: 10,
                page: 1
            },
            tableData: [],
            total: 0,
            pickerOptions2: datePickerOption,
            multipleSelection: [],
            loading: false,
            chooseList: []
        };
    },
    computed: {
        mFormData() {
            let { id, riderId, time, page, limit } = this.formData;
            let startAt = "";
            let endAt = "";
            if (time.length > 0) {
                startAt = moment(time[0]).format("X");
                endAt = moment(time[1]).format("X");
            }
            return { id, riderId, startAt, endAt, limit, page };
        }
    },
    methods: {
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.platformFeedbackList, this.mFormData, true)
                .then(res => {
                    console.log("​getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    console.log("​getList -> err", err);
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    this.loading = false;
                });
        },
        resetForm() {
            this.formData = {
                id: "",
                riderId: "",
                time: [],
                limit: 10,
                page: 1
            };
            this.getList();
        },
        // toDetail(id) {
        //     this.$router.push({ name: "feedbackDetail", params: { id: id } });
        // },
        // handleSelectionChange(val) {
        //     this.multipleSelection = val;
        // },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        deleteOne(id) {
            this.chooseList.push(id);
            this.deleteItems();
        },
        deleteItems() {
            if (!canUse("feedbackDelete")) {
                this.chooseList = [];
                return;
            }
            this.$confirm("确认删除选择的用户反馈?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(res => {
                    if (this.chooseList.length > 0) {
                        this.$http
                            .post(
                                this.$api.platformFeedbackDelete,
                                {
                                    ids: this.chooseList
                                },
                                true
                            )
                            .then(res => {
                                this.$notify({
                                    title: "成功",
                                    message: "删除成功",
                                    type: "success"
                                });
                                if (
                                    this.chooseList.length ==
                                        this.total -
                                            (this.formData.page - 1) *
                                                this.formData.limit &&
                                    this.formData.page > 1
                                ) {
                                    this.formData.page--;
                                }
                                this.chooseList = [];
                                this.getList();
                            })
                            .catch(err => {
                                this.$notify({
                                    title: "失败",
                                    message: "删除成功",
                                    type: "warning"
                                });
                            });
                    }
                })
                .catch(err => {
                    this.$message.info("已取消删除操作");
                });
        },
        handleSelectionChange(val) {
            console.log("​handleSelectionChange -> val", val);
            let arr = [];
            let l = val.length;
            for (let i = 0; i < l; i++) {
                let id = val[i].id;
                arr.push(id);
            }
            this.chooseList = arr;
        }
    }
};
</script>

<style lang="scss" scoped>
pre {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    white-space: pre-wrap;
    display: block;
    padding: 0 30px;
    text-align: left;
}
</style>