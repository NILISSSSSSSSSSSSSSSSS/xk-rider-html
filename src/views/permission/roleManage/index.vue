<template>
    <div class="role-manage rider-container" v-if="Object.keys(allPermission).length>0">
        <div class="rider-switch">
            <div class="tab" :class="{active:roleName==item.name}" v-for='(item,index) in roleList' :key='index' @click='switchTab(item)'>
                {{item.name}}
            </div>
            <!-- 管理员 ADMIN 具有修改,保存,取消,删除等功能
                平台    可以查看权限
                区域    无法查看 -->
            <div class="close-form-btn" v-if='roleType=="ADMIN"'>
                <el-button :size='$size' type='primary' @click='showAddRole=true' v-if='roleCreate'>新增角色</el-button>
            </div>
        </div>
        <div class="rider-checkbox">
            <div class='checkbox-item' v-for='(item,index) in permissions' :key='index'>
                <!-- 全选-->
                <el-checkbox @mousedown.native='nowIndex={index}' @change='handleAllChange' v-model="checkAll[index]">{{item.name}}</el-checkbox>
                <div class="line-flex-start" v-for='(subitem,subindex) in item.resources' :key='subindex' @mousedown='nowIndex={index,subindex}'>
                    <!-- 二级 -->
                    <el-checkbox border :indeterminate="checkedAllStatus['p'+index+subindex].status" v-model="checkedAllStatus['p'+index+subindex].check"
                        @change='handleSubChange'>{{subitem.name}}</el-checkbox>
                    <!-- 子项 -->
                    <el-checkbox-group v-model='checkedList["p"+index+subindex]' @change="handleCheckedChange">
                        <el-checkbox :size='$size' border v-for='ssitem in subitem.resources' :label="ssitem.service"
                            :key='ssitem.service'>{{ssitem.name}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
        <div class="line-flex-start btn-group" v-if='roleType=="ADMIN"'>
            <el-button :size='$size' type='primary' @click='modifyRole' :loading='btnLoading' v-if='roleUpdate'>保存</el-button>
            <el-button :size='$size' type='' @click='$router.go(-1)' :loading='btnLoading'>取消</el-button>
            <el-button :size='$size' type='danger' :loading='btnLoading' :disabled="role.roleType=='SYSTEM'||role.roleType=='ADMIN'"
                @click='deleteRole' v-if='roleDelete'>删除该角色</el-button>
        </div>
        <role-add :show.sync='showAddRole' :roles='roleList' @success='getAddSuccess'></role-add>
    </div>
</template>

<script>
import RoleAdd from "./../../../components/permission/RoleAddNew";
import {
    roleCreate,
    roleDelete,
    roleUpdate
} from "./../../../menu/permission.js";
import { getSession } from "./../../../util/publicMehotds.js";
export default {
    components: {
        RoleAdd
    },
    data() {
        return {
            user: getSession("xk-user")
                ? JSON.parse(getSession("xk-user"))
                : {},
            roleCreate,
            roleDelete,
            roleUpdate,
            permissions: [],
            role: {},
            allPermission: {},
            roleList: [],
            roleName: "",
            showAddRole: false,
            checkAll: [],
            checkedCities: [],
            nowIndex: {},
            checkedList: {},
            checkedAllStatus: {},
            btnLoading: false
        };
    },
    created() {
        this.createLoading();
        this.getResourceList();
    },
    computed: {
        roleType() {
            return this.user.role[0].roleType;
        },
        mCheckedList() {
            let arr = [];
            let list = this.checkedList;
            for (let i1 in list) {
                if (list.hasOwnProperty(i1)) {
                    let item = list[i1];
                    for (let i2 = 0, l2 = item.length; i2 < l2; i2++) {
                        arr.push(item[i2]);
                    }
                }
            }
            return arr;
        }
    },
    methods: {
        switchTab(item) {
            this.roleName = item.name;
            this.getResByName(item);
        },
        getAddSuccess() {
            this.reloadPage();
        },
        // 根据name匹配对应资源表
        getResByName(item) {
            if (item.roleType == "SYSTEM") {
                this.permissions = this.allPermission["partnerResource"];
            } else {
                this.permissions = this.allPermission["platformResource"];
            }
            this.createCheckedList(this.permissions);
            for (let i of this.roleList) {
                if (i.id == item.id) {
                    this.role = item;
                    break;
                }
            }
            console.log("​getResByName -> this.permissions", this.permissions);
            this.findServices();
        },
        // 全部
        handleAllChange(val) {
            let { index } = this.nowIndex;
            let item1 = this.permissions[index].resources;
            if (val) {
                for (let i = 0, ll = item1.length; i < ll; i++) {
                    let item2 = item1[i].resources;
                    let arr = [];
                    for (let j = 0, lll = item2.length; j < lll; j++) {
                        let item3 = item2[j];
                        arr.push(item3.service);
                    }
                    this.checkedList["p" + index + i] = arr;
                    this.checkedAllStatus["p" + index + i].status = false;
                    this.checkedAllStatus["p" + index + i].check = true;
                }
            } else {
                for (let i = 0, ll = item1.length; i < ll; i++) {
                    let item2 = item1[i].resources;
                    let arr = [];

                    this.checkedList["p" + index + i] = arr;
                    this.checkedAllStatus["p" + index + i].status = false;
                    this.checkedAllStatus["p" + index + i].check = false;
                }
            }
        },
        // 二级选项
        handleSubChange(val) {
            let { index, subindex } = this.nowIndex;
            let item = this.permissions[index].resources[subindex].resources;
            let arr = [];
            for (let i = 0, l = item.length; i < l; i++) {
                let service = item[i].service;
                arr.push(service);
            }
            this.checkedList["p" + index + subindex] = val ? arr : [];
            this.checkedAllStatus["p" + index + subindex].status = false;
            this.checkCheckAll();
        },
        // 子选项
        handleCheckedChange(value) {
            let { index, subindex } = this.nowIndex;
            let checkedCount = value.length;

            this.checkedAllStatus["p" + index + subindex].check =
                checkedCount ===
                this.permissions[index].resources[subindex].resources.length;

            this.checkedAllStatus["p" + index + subindex].status =
                checkedCount > 0 &&
                checkedCount <
                    this.permissions[index].resources[subindex].resources
                        .length;
            this.checkCheckAll();
        },
        // 验证是否全选
        checkCheckAll() {
            let length = this.permissions.length;
            let status = false;
            for (let key in this.checkedAllStatus) {
                let index = key[1];
                let subindex = key[2];
                if (this.checkedAllStatus[key].check) {
                    status = true;
                }
                if (!this.checkedAllStatus[key].check) {
                    status = false;
                }
                this.checkAll[index] = status;
            }
            this.closeLoading();
        },
        // 更新或者新建是否checked列表
        createCheckedList(list) {
            this.checkedList = {};
            let obj = {};
            let obj2 = {};
            for (let i = 0, l = list.length; i < l; i++) {
                let subitem = list[i].resources;
                for (let j = 0, x = subitem.length; j < x; j++) {
                    obj["p" + i + j] = [];
                    obj2["p" + i + j] = { check: false, status: false };
                }
            }
            this.checkedList = obj;
            this.checkedAllStatus = obj2;
        },
        // 获取资源列表
        getResourceList() {
            this.$http
                .get(this.$api.permissionResourceList, {}, true)
                .then(res => {
                    console.log("​getResourceList -> res", res);
                    this.allPermission = res;
                    this.permissions = res.partnerResource;
                    this.$nextTick(() => {
                        this.getRoleList();
                    });
                })
                .catch(err => {
                    this.$message.error("无法获取资源列表");
                    this.closeLoading();
                });
        },
        // 获取角色列表
        getRoleList() {
            this.createCheckedList(this.permissions);
            this.$http
                .get(
                    this.$api.permissionRoleList,
                    { limit: 1000, page: 1 },
                    true
                )
                .then(res => {
                    console.log("​getRoleList -> res", res);
                    this.roleList = res.data;
                    if (res.data.length > 0) {
                        if (!this.roleName) {
                            this.roleName = res.data[0].name;
                            // this.role = res.data[0];
                        }
                        this.setRole(res.data);
                        this.$nextTick(() => {
                            this.findServices();
                        });
                    }
                })
                .catch(err => {
                    this.$message.error("无法获取角色列表");
                    this.closeLoading();
                });
        },
        // 更新当前角色
        setRole(roleList) {
            let roleName = this.roleName;
            for (let i in roleList) {
                if (roleList[i].name == roleName) {
                    this.role = roleList[i];
                    return;
                }
            }
        },
        // 找到当前角色的权限
        findServices() {
            let permission = this.permissions;
            let services = this.role.services || [];
            for (let i1 = 0, l1 = permission.length; i1 < l1; i1++) {
                let item1 = permission[i1].resources;
                for (let i2 = 0, l2 = item1.length; i2 < l2; i2++) {
                    let item2 = item1[i2].resources;
                    for (let i3 = 0, l3 = item2.length; i3 < l3; i3++) {
                        let item3 = item2[i3].service;
                        if (services.includes(item3)) {
                            this.checkedList["p" + i1 + i2].push(item3);
                        }
                    }
                    this.findCheckStatus(i1, i2);
                }
            }
            this.checkCheckAll();
        },
        // 找到当前角色的权限状态，全选等等
        findCheckStatus(i1, i2) {
            let checkLength = this.checkedList["p" + i1 + i2].length;
            this.checkedAllStatus["p" + i1 + i2].check =
                checkLength ===
                this.permissions[i1].resources[i2].resources.length;
            this.checkedAllStatus["p" + i1 + i2].status =
                checkLength > 0 &&
                checkLength <
                    this.permissions[i1].resources[i2].resources.length;
        },
        // 删除角色
        deleteRole() {
            this.btnLoading = true;
            this.$confirm("确认删除该角色", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(res => {
                    let data = { id: this.role.id };
                    this.$http
                        .post(this.$api.permissionDeleteRole, data, true)
                        .then(res => {
                            this.$notify({
                                title: "提示",
                                message: "删除成功",
                                type: "success"
                            });
                            // this.getRoleList();
                            this.btnLoading = false;
                            this.permissions = this.allPermission.partnerResource;
                            this.roleName = "";
                            this.reloadPage();
                        })
                        .catch(err => {
                            this.btnLoading = false;
                            this.$notify({
                                title: "提示",
                                message: "删除失败 " + err.message,
                                type: "warning"
                            });
                        });
                })
                .catch(err => {
                    this.btnLoading = false;
                    this.$message.info("用户取消");
                });
        },
        // 保存
        modifyRole() {
            if (this.role.roleType == "SYSTEM") {
                this.$message.error("区域管理员权限不可修改");
                return;
            }
            this.btnLoading = true;
            let data = { id: this.role.id, services: this.mCheckedList };
            let api = this.$api.permissionUpdateRole;
            this.$http
                .post(api, data, true)
                .then(res => {
                    this.$notify({
                        title: "提示",
                        message: "修改成功",
                        type: "success"
                    });
                    // this.getRoleList();
                    this.btnLoading = false;
                    this.reloadPage();
                })
                .catch(err => {
                    this.btnLoading = false;
                    this.$notify({
                        title: "提示",
                        message: "修改失败",
                        type: "warning"
                    });
                });
        },
        // 更新后重置页面
        reloadPage() {
            this.createLoading();
            // this.permissions = this.allPermission.partnerResource;
            this.checkedList = {};
            this.checkedAllStatus = {};
            this.getRoleList();
        },
        createLoading() {
            this.loading = this.$loading({
                lock: true,
                text: "更新中",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.5)",
                target: document.querySelector(".role-manage")
            });
        },
        closeLoading() {
            setTimeout(() => {
                this.loading.close();
            }, 1000);
        }
    }
};
</script>
<style lang="scss" scoped>
.rider-checkbox {
    margin-top: 30px;
}
.line-flex-start.btn-group {
    padding-left: 100px;
    margin-top: 25px;
}
.line-flex-start {
    padding: 20px 25px 10px;
    .el-checkbox-group {
        margin-left: 20px;
    }
}
.checkbox-item {
    margin-top: 25px;
}
</style>
