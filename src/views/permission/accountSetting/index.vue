<template>
    <div class="account-setting rider-container">
        <div class="rider-switch">
            <div class='tab' :class="{active:tabName=='all'}" @click='switchTab("all")'>全部</div>
            <!-- <div
                class='tab'
                :class="{active:tabName=='area'}"
                @click='switchTab("area")'
            >区域负责人</div>
            <div
                class='tab'
                :class="{active:tabName=='finance'}"
                @click='switchTab("finance")'
            >财务人员</div> -->
            <div class="close-form-btn">
                <el-button type='primary' :size='$size' @click='openAddNew' v-if='accountCreate'>新增账号</el-button>
            </div>
        </div>
        <!-- <div class="rider-search">
            <el-form label-width="100px">
                <div class="line-flex-start">
                    <div class='line-space-between'>
                        <el-input
                            class="rider-input margin-right-20"
                            placeholder="输入骑士ID / 手机号 / 姓名"
                            :size='$size'
                        ></el-input>
                        <el-button
                            :size='$size'
                            class="rider-btn submit"
                        >搜索</el-button>
                    </div>
                </div>

            </el-form>
        </div> -->
        <div class="rider-table">
            <div class="rider-table-btn-group">
                <el-button class='rider-btn submit' :disabled="!multipleSelection.length" @click='activeAll'>批量激活</el-button>
                <el-button class='rider-btn cancel' :disabled="!multipleSelection.length" @click='frozenAll'>批量冻结</el-button>
                <span>已选中<span class="text-blue">{{multipleSelection.length}}</span>个用户</span>
            </div>
            <el-table fit :data='tableData' :size='$size' @selection-change="handleSelectionChange" ref="multipleTable"
                v-loading='loading' element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column type='selection' width="80"></el-table-column>
                <!-- <el-table-column v-for='(item,index) in tableInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width="item.width"></el-table-column> -->
                <el-table-column label='账号ID' prop='userId' min-width="150"></el-table-column>
                <el-table-column label='邀请码' prop='referralCode' min-width="150">
                    <template slot-scope='scope'>
                        {{scope.row.referralCode||"非区域管理员"}}
                    </template>
                </el-table-column>
                <el-table-column label='状态' prop='isFrozen' min-width="90">
                    <template slot-scope='scope'>
                        {{scope.row.isFrozen?'已冻结':"已激活"}}
                    </template>
                </el-table-column>
                <el-table-column label='用户姓名' prop='realName' min-width="130"></el-table-column>
                <el-table-column label='用户角色' prop='role' min-width="130">
                    <template slot-scope='scope'>
                        {{scope.row.role[0]}}
                    </template>
                </el-table-column>
                <el-table-column label='所属区域' prop='districtCode' min-width="150">
                    <template slot-scope='scope'>
                        {{scope.row.cityCode|getCityName}} {{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                <el-table-column label='手机号码' prop='phone' min-width="140"></el-table-column>
                <el-table-column label='注册时间' prop='createdAt' width="120">
                    <template slot-scope='scope'>
                        {{scope.row.createdAt|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='最后登录时间' prop='id' width="120">
                    <template slot-scope='scope'>
                        {{scope.row.lastLoginAt|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='最后登录IP' prop='ip' min-width="150"></el-table-column>
                <el-table-column label="操作" width='150'>
                    <template slot-scope='scope'>
                        <el-button type="primary" :size='$size' @click='modify(scope.row)'>修改</el-button>
                        <el-button type="info" :size='$size' v-if='scope.row.isFrozen' @click='activeOne(scope.row)'>激活</el-button>
                        <el-button type="danger" :size='$size' v-else @click='frozenOne(scope.row)'>冻结</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <el-dialog
            title='用户信息'
            modal-append-to-body
            :visible.sync="openDetail"
            width='500px'
        >
            <user-info></user-info>
            <div
                class="btn-group"
                slot='footer'
            >
                <el-button
                    type='primary'
                    :size='$size'
                    @click='openDetail=false'
                >关闭</el-button>
            </div>
        </el-dialog> -->
        <add-new :show.sync='showAddNew' :item='modifyItem' @success='getList()'></add-new>
        <Pagination :form='formData' :total='total' @page='getPage'></Pagination>
    </div>
</template>
<script>
import AddNew from "./../../../components/permission/AccountAddNew";
import { canUse, accountCreate } from "./../../../menu/permission.js";
export default {
    components: {
        AddNew
    },
    data() {
        return {
            accountCreate,
            showAddNew: false,
            formData: { limit: 10, page: 1 },
            tableData: [],
            total: 0,
            tabName: "all",
            select: "1",
            modifyItem: {},
            multipleSelection: [],
            loading: false
        };
    },
    methods: {
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.permissionAccountList, this.formData, true)
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
        switchTab(tab) {
            this.tabName = tab;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        openAddNew() {
            this.modifyItem = {};
            this.showAddNew = true;
        },
        modify(item) {
            if (!canUse("accountUpdate")) return;
            if (item && item.role && item.role[0] == "超级角色") {
                this.$message.error("无法操作超级角色");
            } else {
                this.modifyItem = item;
                this.showAddNew = true;
            }
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        // 冻结相关
        frozenOne(item) {
            if (item && item.role && item.role[0] == "超级角色") {
                this.$message.error("无法操作超级角色");
            } else {
                this.$confirm("确认冻结该账户?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(res => {
                        let arr = [];
                        arr.push(item.userId);
                        this.frozenItems(arr);
                    })
                    .catch(err => {
                        this.$message.info("已取消操作");
                    });
            }
        },
        frozenAll() {
            let all = this.multipleSelection;
            this.checkFrozenRole(all).then(res => {
                this.$confirm(
                    "不能冻结超级管理员,已自动排除,点击确认继续",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                    .then(res => {
                        let list = this.multipleSelection;
                        let arr = [];
                        for (let item of list) {
                            arr.push(item.userId);
                        }
                        console.log("​frozenAll -> arr", arr);
                        this.frozenItems(arr);
                    })
                    .catch(err => {
                        this.$message.info("已取消操作");
                    });
            });
        },
        frozenItems(roleList) {
            if (!canUse("accountFrozen")) return;
            if (roleList.length == 0) {
                this.$message.warning("操作数量为0,请重新选择");
                return;
            }
            let data = {
                uids: roleList
            };
            this.$http
                .post(this.$api.permissionAccountFrozen, data, true)
                .then(res => {
                    this.$notify({
                        title: "成功",
                        message: "冻结成功",
                        type: "success"
                    });
                    this.getList();
                })
                .catch(err => {
                    this.$notify({
                        title: "失败",
                        message: "冻结失败",
                        type: "warning"
                    });
                });
        },
        // 激活相关
        activeOne(item) {
            if (item && item.role && item.role[0] == "超级角色") {
                this.$message.error("无法操作超级管理员");
            } else {
                this.$confirm("确认激活该账户?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(res => {
                        let arr = [];
                        arr.push(item.userId);
                        this.activeItems(arr);
                    })
                    .catch(err => {
                        this.$message.info("已取消操作");
                    });
            }
        },
        activeAll() {
            let all = this.multipleSelection;
            this.checkFrozenRole(all).then(res => {
                this.$confirm(
                    "不能激活超级管理员,已自动排除,点击确认继续",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                    .then(res => {
                        let list = this.multipleSelection;
                        let arr = [];
                        for (let item of list) {
                            arr.push(item.userId);
                        }
                        console.log("​frozenAll -> arr", arr);
                        this.activeItems(arr);
                    })
                    .catch(err => {
                        this.$message.info("已取消操作");
                    });
            });
        },
        activeItems(roleList) {
            if (!canUse("accountActive")) return;
            if (roleList.length == 0) {
                this.$message.warning("操作数量为0,请重新选择");
                return;
            }
            let data = {
                uids: roleList
            };
            this.$http
                .post(this.$api.permissionAccountActive, data, true)
                .then(res => {
                    this.$notify({
                        title: "成功",
                        message: "激活成功",
                        type: "success"
                    });
                    this.getList();
                })
                .catch(err => {
                    this.$notify({
                        title: "失败",
                        message: "激活失败",
                        type: "warning"
                    });
                });
        },
        // 验证是否冻结超级管理员
        checkFrozenRole(roleList) {
            return new Promise((resolve, reject) => {
                if (roleList.length > 0) {
                    for (let i in roleList) {
                        let item = roleList[i];
                        if (item.role[0] == "超级角色") {
                            this.toggleSelection([this.tableData[i]]);
                            this.$message.error("无法操作超级角色");
                        }
                    }
                }
                resolve();
            });
        },
        // 自动取消选择超级管理员
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        }
    }
};
</script>