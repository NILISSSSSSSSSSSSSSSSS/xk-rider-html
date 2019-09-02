<template>
    <div class="group-leader-manage rider-container">
        <div class="rider-switch">
            <div class="tab active">组长管理</div>
            <div class="close-form-btn">
                <el-button :size="$size" type='primary' @click="openAdd=true" v-if='createCaptain'>新增组长账号</el-button>
            </div>
        </div>
        <div class="rider-search">
            <el-form :size='$size' :inline="true" :model='formData'>
                <el-form-item label='关键字:'>
                    <el-input :size='$size' class="rider-input" v-model='formData.key' placeholder="请输入账号/姓名/手机号"></el-input>
                </el-form-item>
                <el-form-item label=' '>
                    <el-button :size='$size' type='primary' class="rider-btn" @click="getList()">搜索</el-button>
                    <el-button :size='$size' class="rider-btn cancel" @click='reset()'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table :size='$size' fit :data='tableData' v-loading='loading' element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column label='账号ID' prop='id' min-width="100"></el-table-column>
                <el-table-column label='状态'>
                    <template slot-scope='scope'>
                        {{scope.row.isFrozen?'已停用':'已激活'}}
                    </template>
                </el-table-column>
                <el-table-column label='用户姓名' prop='realName'></el-table-column>
                <el-table-column label='手机号码' prop='phone'></el-table-column>
                <el-table-column label='所属区域'>
                    <template slot-scope='scope'>
                        {{scope.row.cityCode|getCityName}}{{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                <el-table-column label='注册时间' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.createdAt|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='操作' min-width="120">
                    <template slot-scope='scope'>
                        <el-button :size='$size' type='primary' v-if='scope.row.isFrozen==0' @click='setPermission(scope.row)'>权限分配</el-button>
                        <el-button :size='$size' type='info' v-if='scope.row.isFrozen==0' @click='freezeP(scope.row.id)'>冻结</el-button>
                        <el-button :size='$size' type='primary' v-else @click='activeP(scope.row.id)'>激活</el-button>
                        <el-button :size='$size' type='danger' @click='deleteP(scope.row.id)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Add :show.sync='openAdd' @success='getList()'></Add>
        <set-permission :show.sync='openSetPermission' :gid='gid' :service='services' @success='getList'></set-permission>
        <Pagination :form='formData' :total='total' @page='getPage'></Pagination>
    </div>
</template>
<script>
import Add from "./../../../components/operation/AddGroupLeader";
import SetPermission from "./../../../components/operation/SetGroupLeaderPermission";
import {
    createCaptain,
    updateCaptain,
    deleteCaptain,
    frozenCaptain,
    activeCaptain,
    updateCaptainResource,
    canUse
} from "./../../../menu/permission.js";
export default {
    components: {
        Add,
        SetPermission
    },
    data() {
        return {
            tableData: [],
            openAdd: false,
            openSetPermission: false,
            createCaptain,
            gid: "",
            services: [],
            formData: {
                key: "",
                page: 1,
                limit: 10
            },
            total: 0,
            loading: false
        };
    },
    created() {},
    methods: {
        getList() {
            this.loading = true;
            this.$http
                .get(
                    this.$api.operationGetGroupLeaderList,
                    { ...this.formData },
                    true
                )
                .then(res => {
                    console.log("​getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    console.log("​getList -> err", err);
                });
        },
        reset() {
            this.formData = { key: "", page: 1, limit: 10 };
            this.getList();
        },
        freezeP(id) {
            if (!canUse("frozenCaptain")) return;
            let userIds = [];
            userIds.push(id);
            this.$confirm("确认冻结该组长", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(res => {
                    this.$http
                        .post(
                            this.$api.operationFreezeLeader,
                            { userIds },
                            true
                        )
                        .then(res => {
                            console.log("​freezeP -> res", res);
                            this.getList();
                        })
                        .catch(err => {
                            this.$notify.warning({
                                title: "提示",
                                message: `停用失败 错误码${err.code}`
                            });
                            console.log("​freezeP -> err", err);
                        });
                })
                .catch(err => {});
        },
        activeP(id) {
            if (!canUse("activeCaptain")) return;
            let userIds = [];
            userIds.push(id);
            this.$confirm("确认激活该组长", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(res => {
                    this.$http
                        .post(
                            this.$api.operationActiveLeader,
                            { userIds },
                            true
                        )
                        .then(res => {
                            console.log("​freezeP -> res", res);
                            this.getList();
                        })
                        .catch(err => {
                            this.$notify.warning({
                                title: "提示",
                                message: `激活失败 错误码${err.code}`
                            });
                            console.log("​freezeP -> err", err);
                        });
                })
                .catch(err => {});
        },
        deleteP(id) {
            if (!canUse("deleteCaptain")) return;
            // let userIds = [];
            // userIds.push(id);
            this.$confirm("确认删除该组长", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(res => {
                    this.$http
                        .post(
                            this.$api.operationGroupLeaderDelete,
                            { captainId: id },
                            true
                        )
                        .then(res => {
                            this.getList();
                        })
                        .catch(err => {
                            this.$notify.warning({
                                title: "提示",
                                message: `删除失败 错误码${err.code}`
                            });
                        });
                })
                .catch(err => {});
        },
        setPermission(leader) {
            if (!canUse("updateCaptainResource")) return;
            this.gid = leader.id;
            this.services = leader.captainService;
            this.openSetPermission = true;
        },
        getPage(val) {
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        }
    }
};
</script>

