<template>
    <div class="push-detail-manage rider-container">
        <div class="rider-switch">
            <div class="tab active">App推送</div>
            <div class="close-form-btn">
                <el-button :size='$size' type="primary" @click='$router.push({name:"publish"})' v-if='publish'>新建推送</el-button>
            </div>
        </div>
        <div class="rider-search">
            <el-form label-width="100px" :inline="true" :model='formData' ref="formData">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='推送ID:' prop='id'>
                            <el-input :size='$size' class="rider-input" v-model='formData.id' placeholder="请输入ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='新建时间:' prop='timeC'>
                            <el-date-picker class="rider-input input-350" :size='$size' type="datetimerange"
                                :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" align="right" v-model='formData.timeC'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='推送时间:' prop='timeP'>
                            <el-date-picker class="rider-input input-350" :size='$size' type="datetimerange"
                                :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" align="right" v-model='formData.timeP'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='推送类型:' prop='activeType'>
                            <el-select :size='$size' class="rider-input" v-model='formData.activeType'>
                                <el-option v-for='(item,index) in pushType' :key='index' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='推送状态' prop='isPush'>
                            <el-select :size='$size' class="rider-input" v-model='formData.isPush'>
                                <el-option v-for='(item,index) in pushStatus' :key='index' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label='推送区域'></el-form-item>
                    </el-col> -->
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label=' '>
                            <el-button :size='$size' class="rider-btn submit" @click='getList()'>搜索</el-button>
                            <el-button :size='$size' class="rider-btn cancel" @click='resetForm("formData")'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <div class="rider-table-btn-group">
                <el-button class='rider-btn' type='danger' :disabled="deleteList.length==0" @click='deleteItem(deleteList)'>批量删除</el-button>
                <span>已选中<span class="text-blue">{{deleteList.length}}</span>条推送</span>
            </div>
            <el-table :data='tableData' fit v-loading='loading' @selection-change="getDeleteList"
                element-loading-background="rgba(0,0,0,0.8)" :size='$size'>
                <el-table-column type='selection' width='80'></el-table-column>
                <el-table-column label='序号' type='index' :index='function(index){return (index+1)+(formData.page-1)*formData.limit}'
                    prop="" width='100'></el-table-column>
                <el-table-column label='推送ID' prop="id" min-width='160'></el-table-column>
                <el-table-column label='标题' prop="title" min-width='140'></el-table-column>
                <el-table-column label='推送区域' prop="districtCode" min-width='120'>
                    <template slot-scope='scope'>{{scope.row.districtCode?(scope.row.districtCode|getDistrictName):("全部")}}</template>
                </el-table-column>
                <el-table-column label='用户类型' prop="userType" min-width='90'>
                    <template slot-scope='scope'>{{scope.row.userType?scope.row.userType:"全部"}}</template>
                </el-table-column>
                <el-table-column label='推送类型' prop="status" min-width='90'>
                    <template slot-scope='scope'>
                        {{scope.row.activeType=='active'?'活动':'公告'}}
                    </template>
                </el-table-column>
                <el-table-column label='推送时间' prop="" min-width='120'>
                    <template slot-scope='scope'>{{scope.row.pushTime|formatTime}}</template>
                </el-table-column>
                <el-table-column label='推送状态' prop="isPush" min-width='90'>
                    <template slot-scope='scope'>{{scope.row.isPush?'已推送':'未推送'}}</template>
                </el-table-column>
                <el-table-column label='操作' min-width='120'>
                    <template slot-scope='scope'>
                        <div>
                            <el-button :size='$size' type="primary" class='submit' v-if='scope.row.isPush' @click='toDetail(scope.row)'>查看</el-button>
                            <el-button :size='$size' type="primary" class='submit' v-else @click='toModify(scope.row)'>修改</el-button>
                            <el-button :size='$size' type='danger' @click='deleteOne(scope.row.id)'>删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <push-detail :show.sync='openDetail' :form='showDetail'></push-detail>
        <Pagination @page='getPage' :total='total' :form='formData'></Pagination>
    </div>
</template>
<script>
import { datePickerOption } from "./../../../../util/publicParams.js";
import { saveSession } from "./../../../../util/publicMehotds.js";
import moment from "moment";
import { mapMutations } from "vuex";
import { publish, canUse } from "./../../../../menu/permission.js";
import PushDetail from "./../../../../components/platform/AgreementDetail";
export default {
    components: {
        PushDetail
    },
    data() {
        let pushType = [
            { label: "全部", value: "" },
            { label: "活动", value: "active" },
            { label: "公告", value: "notice" }
        ];
        let pushStatus = [
            { label: "全部", value: "" },
            { label: "已推送", value: "1" },
            { label: "未推送", value: "0" }
        ];
        return {
            pushType,
            pushStatus,
            publish,
            formData: {
                id: "",
                timeC: [],
                timeP: [],
                districtCode: "",
                activeType: "",
                isPush: "",
                page: 1,
                limit: 10
            },
            deleteList: [],
            total: 0,
            pickerOptions2: datePickerOption,
            tableData: [],
            openDetail: false,
            showDetail: {},
            loading: false
        };
    },
    computed: {
        mFormData() {
            let {
                id,
                timeC,
                timeP,
                districtCode,
                activeType,
                isPush,
                page,
                limit
            } = this.formData;
            let createdAt = "";
            let createdEnd = "";
            let pushTimeAt = "";
            let pushTimeEnd = "";
            if (timeC[0]) {
                createdAt = moment(timeC[0]).format("X");
                createdEnd = moment(timeC[1]).format("X");
            }
            if (timeP[0]) {
                pushTimeAt = moment(timeP[0]).format("X");
                pushTimeEnd = moment(timeP[1]).format("X");
            }
            return {
                id,
                createdAt,
                createdEnd,
                pushTimeAt,
                pushTimeEnd,
                districtCode,
                activeType,
                isPush,
                page,
                limit
            };
        }
    },
    methods: {
        ...mapMutations({
            saveDetail: "publish/saveDetail"
        }),
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.platformPublishList, this.mFormData, true)
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
        resetForm(formName) {
            this.formData = {
                id: "",
                timeC: [],
                timeP: [],
                districtCode: "",
                activeType: "",
                isPush: "",
                page: 1,
                limit: 10
            };
            this.getList();
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        toDetail(item) {
            // if (!canUse("publish")) return;
            let { title, content, h5Url, status, pushTime, subTitle } = item;
            let detail = {
                title,
                content,
                h5Url,
                status,
                pushTime,
                subTitle
            };
            this.showDetail = detail;
            this.openDetail = true;
            // this.saveDetail(detail);
            // saveSession("publishDetail", JSON.stringify(detail));
            // this.$router.push({
            //     name: "publish",
            //     query: {
            //         type: "detail"
            //         // detail: JSON.stringify({
            //         //     title,
            //         //     content,
            //         //     h5Url,
            //         //     status,
            //         //     pushTime
            //         // })
            //     }
            // });
        },
        toModify(item) {
            if (!canUse("pushContentUpdate")) return;
            let {
                id,
                title,
                content,
                h5Url,
                status,
                pushTime,
                subTitle
            } = item;
            let detail = {
                id,
                title,
                content,
                h5Url,
                status,
                pushTime,
                subTitle
            };
            this.saveDetail(detail);
            saveSession("publishDetail", JSON.stringify(detail));
            this.$router.push({
                name: "publish",
                query: {
                    type: "modify"
                }
            });
        },
        getDeleteList(val) {
            let arr = [];
            val.forEach(item => {
                arr.push(item.id);
            });
            this.deleteList = arr;
        },
        deleteOne(id) {
            let arr = [id];
            this.deleteItem(arr);
        },
        deleteItem(arr) {
            if (!canUse("pushContentDelete")) return;
            this.$confirm("确认删除该推送", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$http
                        .post(
                            this.$api.platformPublishDelete,
                            { ids: arr },
                            true
                        )
                        .then(res => {
                            console.log("​deleteItem -> res", res);
                            if (
                                arr.length ==
                                    this.total -
                                        (this.formData.page - 1) *
                                            this.formData.limit &&
                                this.formData.page > 1
                            ) {
                                this.formData.page--;
                            }
                            this.getList();
                        })
                        .catch(err => {
                            console.log("​deleteItem -> err", err);
                            this.$message.error("删除失败" + err.code);
                        });
                })
                .catch(() => {
                    this.$message.info({ title: "提示", message: "已取消" });
                });
        }
    }
};
</script>


