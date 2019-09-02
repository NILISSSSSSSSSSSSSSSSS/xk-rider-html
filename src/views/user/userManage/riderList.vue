<template>
    <div class="user-list rider-container">
        <div class="rider-switch">
            <div class='tab' :class="{active:formData.isFrozen==''}" @click='switchTab("all","")'>全部骑士</div>
            <div class='tab' :class="{active:formData.isFrozen=='1'}" @click='switchTab("freeze","1")'>已冻结骑士</div>
        </div>
        <div class="rider-search">
            <el-form label-width="100px" :model="formData" :inline="true">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='骑士ID:'>
                            <el-input class="rider-input margin-right-20" placeholder="输入骑士ID" v-model='formData.uid'
                                :size='$size'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='骑士姓名:'>
                            <el-input class="rider-input margin-right-20" placeholder="输入骑士姓名" :size='$size' v-model='formData.realName'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='手机号码:'>
                            <el-input class="rider-input margin-right-20" placeholder="输入骑士手机号" :size='$size' v-model='formData.phone'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='区域负责人:'>
                            <el-select class="rider-input" :size='$size' v-model='formData.partnerId'>
                                <el-option v-for='(item,index) in areaLeaders' :key='index' :label='item.realName'
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='工作状态:'>
                            <el-select class="rider-input" :size='$size' v-model='formData.isAccessOrder'>
                                <el-option v-for='(item,index) in isWork' :key='index' :label='item.label' :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label='商品类型:'>
                            <el-select
                                class="rider-input"
                                :size='$size'
                                v-model='formData.level'
                            >
                                <el-option
                                    v-for='(item,index) in orderType'
                                    :key='index'
                                    :label='item.label'
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label=' '>
                            <el-button class="rider-btn submit" @click='getList'>搜索</el-button>
                            <el-button class="rider-btn cancel" @click='reset'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <div class="rider-table-btn-group">
                <el-button class='rider-btn submit' :disabled="mRiderList.length==0" @click='activeItems(mRiderList)'>批量激活</el-button>
                <el-button class='rider-btn cancel' :disabled="mRiderList.length==0" @click='frozenItems(mRiderList)'>批量冻结</el-button>
                <span>已选中<span class="text-blue">{{multipleSelection.length}}</span>个用户</span>
            </div>
            <el-table fit :data='tableData' :size='$size' v-loading='loading' element-loading-background='rgba(0,0,0,0.8)'
                @selection-change="handleSelectionChange">
                <el-table-column type='selection' width="80"></el-table-column>
                <el-table-column type='index' width="80" :index='function(index){return (index+1)+(formData.page-1)*formData.limit}'
                    label='序号'></el-table-column>
                <el-table-column label='骑士ID' prop='id' min-width='160'></el-table-column>
                <el-table-column label='账号状态' prop='isFrozen' min-width='90'>
                    <template slot-scope='scope'>
                        {{scope.row.isFrozen?"已冻结":"已激活"}}
                    </template>
                </el-table-column>
                <el-table-column label='手机号码' prop='phone' min-width='150'></el-table-column>
                <el-table-column label='工作状态' prop='' min-width='90'>
                    <template slot-scope='scope'>
                        {{scope.row.isAccessOrder?"接单中":"休息中"}}
                    </template>
                </el-table-column>
                <el-table-column label='配送区域' prop='districtCode' min-width='150'>
                    <template slot-scope='scope'>{{scope.row.cityCode|getCityName}}
                        {{scope.row.districtCode|getDistrictName}}</template>
                </el-table-column>
                <el-table-column label='实名认证' prop='id' min-width='115'>
                    <template slot-scope='scope'>
                        {{scope.row.idCardAuthStatus|AuthStatus}}
                    </template>
                </el-table-column>
                <el-table-column label='健康证认证' prop='id' min-width='115'>
                    <template slot-scope='scope'>
                        {{scope.row.healthCardAuthStatus|AuthStatus}}
                    </template>
                </el-table-column>
                <el-table-column label='骑士姓名' prop='realName' min-width='140'></el-table-column>
                <el-table-column label='区域负责人' prop='partnerName' min-width='140'>
                    <template slot-scope='scope'>
                        {{scope.row.partnerName||'暂未绑定'}}
                    </template>
                </el-table-column>
                <el-table-column label="基本资料" width='90'>
                    <template slot-scope='scope'>
                        <div class='text-blue point-style' @click='openDialog(scope.row.id)'>查看</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单列表" width='90'>
                    <template slot-scope='scope'>
                        <div class='text-blue point-style' @click='toOrderList(scope.row.id,scope.row.realName)'>查看</div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width='120'>
                    <template slot-scope='scope'>
                        <div>
                            <el-button :size='$size' type="primary" v-if='scope.row.isFrozen' @click='activeUser(scope.row.id)'>激活</el-button>
                            <el-button :size='$size' type="danger" @click='freezeUser(scope.row.id)' v-else>冻结</el-button>
                        </div>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <Pagination :form='formData' :total='total' @page='getPage'></Pagination>
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
        <user-info :show.sync='openDetail' :uid='detailID'></user-info>
    </div>
</template>
<script>
import UserInfo from "../../../components/user/UserInfoDisplay";
// import ProvinceCascader from "../../../components/ProvinceCascader";
import {
    riderFrozen,
    riderActive,
    riderDetail,
    canUse
} from "./../../../menu/permission.js";
// import { datePickerOption } from "./../../../util/publicParams.js";
export default {
    components: {
        UserInfo
        // ProvinceCascader
    },
    data() {
        let isWork = [
            { label: "全部", value: "" },
            { label: "接单中", value: "1" },
            { label: "休息中", value: "0" }
        ];
        return {
            riderFrozen,
            riderActive,
            riderDetail,
            // userRole,
            isWork,
            orderStatus: JSON.parse(localStorage.getItem("orderStatus")),
            XKmodule: JSON.parse(localStorage.getItem("XKModule")),
            orderType: JSON.parse(localStorage.getItem("orderType")),
            openDetail: false,
            detailID: "",
            tabName: "all",
            formData: {
                uid: "",
                realName: "",
                partnerId: "",
                isAccessOrder: "",
                isFrozen: "",
                phone: "",
                limit: 10,
                page: 1
            },
            areaLeaders: [],
            total: 0,
            loading: false,
            // pickerOptions2: datePickerOption,
            tableData: [],
            pageKey: this.$route.path.replace("/", ""),
            multipleSelection: []
        };
    },
    computed: {
        mRiderList() {
            let arr = [];
            for (let item of this.multipleSelection) {
                arr.push(item.id);
            }
            return arr;
        }
    },
    created() {
        this.getAreaLeaders();
    },
    methods: {
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        getAreaLeaders() {
            this.$http
                .get(this.$api.userGetAreaLeaders, {}, true)
                .then(res => {
                    console.log("​getAreaLeaders -> res", res);
                    this.areaLeaders = [{ realName: "全部", id: "" }, ...res];
                })
                .catch(err => {
                    this.$message.error(
                        "暂时无法获取区域管理员 错误码:" + err.code
                    );
                });
        },
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.userRiderList, this.formData, true)
                .then(res => {
                    console.table(res.data);
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
            this.formData = {
                uid: "",
                realName: "",
                partnerId: "",
                isAccessOrder: "",
                isFrozen: "",
                phone: "",
                limit: 10,
                page: 1
            };
            this.getList();
        },
        switchTab(tab, status) {
            this.tabName = tab;
            this.formData.isFrozen = status;
            this.getList();
        },
        // toRecord() {
        //     this.$router.push({ path: "/userlistrecord" });
        // },
        // isFreeze(id, on) {
        //     console.log(on, id);
        // },isFreeze(id, on) {
        // console.log(on, id);
        // },
        openDialog(id) {
            if (!canUse("riderDetail")) return;
            this.openDetail = true;
            this.detailID = id;
            this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        activeUser(id) {
            if (!canUse("riderActive")) return;
            this.$confirm("确认激活该用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.activeOne(id);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    });
                });
        },
        freezeUser(id) {
            if (!canUse("riderFrozen")) return;
            this.$confirm("确认冻结该用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.frozenOne(id);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    });
                });
        },
        toOrderList(id, name) {
            this.$router.push({
                name: "orderList",
                query: { id, name }
            });
        },
        activeOne(id) {
            let arr = [];
            arr.push(id);
            this.activeItems(arr);
        },
        activeItems(riderList) {
            if (!canUse("riderActive")) return;
            this.$http
                .post(this.$api.userRiderActive, { userIds: riderList }, true)
                .then(res => {
                    this.$notify({
                        title: "成功",
                        message: "激活成功",
                        type: "success"
                    });
                    this.getList();
                });
        },
        frozenOne(id) {
            let arr = [];
            arr.push(id);
            this.frozenItems(arr);
        },
        frozenItems(riderList) {
            if (!canUse("riderFrozen")) return;
            this.$http
                .post(this.$api.userRiderFrozen, { userIds: riderList }, true)
                .then(res => {
                    this.$notify({
                        title: "成功",
                        message: "冻结成功",
                        type: "success"
                    });
                    this.getList();
                });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    }
};
</script>

<style lang="scss" scoped>
.user-list {
    .search {
        border-radius: 8px;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    }

    .list {
        padding-top: 20px;
    }
}
</style>