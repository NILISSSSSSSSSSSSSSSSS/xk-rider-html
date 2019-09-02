<template>
    <div class="people-platform-check rider-container">
        <div class="rider-switch">
            <div class='tab' :class="{active:tabName=='ID'}" @click='switchTab("ID")' v-if='checkIDList'>身份证</div>
            <div class='tab' :class="{active:tabName=='health'}" @click='switchTab("health")' v-if='checkHealthList'>健康证</div>
        </div>
        <keep-alive>
            <auto-deal :autoType='{type:"IDCARD_AUTO_AUTH"}' v-if="autoCheckIDDetail&&tabName=='ID'" :key='tabName'></auto-deal>
            <auto-deal :autoType='{type:"HEALTHCAR_AUTO_AUTH"}' v-if="autoCheckHealthDetail&&tabName=='health'" :key='tabName'></auto-deal>
        </keep-alive>
        <div class="rider-search">
            <h1 class="title">审核列表</h1>
            <el-form label-width='100px' label-position="center" :model='formData' :inline="true" @keyup.enter.native="getList()">
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='骑手ID:'>
                            <el-input class='rider-input margin-right-20' placeholder="输入骑士ID" :size='$size' v-model="formData.riderId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='骑手姓名:'>
                            <el-input class='rider-input margin-right-20' placeholder="输入骑士姓名" :size='$size' v-model="formData.realName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='手机号码:'>
                            <el-input class='rider-input margin-right-20' placeholder="输入骑手手机号" type='number' :size='$size'
                                v-model="formData.phone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='申请日期:'>
                            <el-date-picker :size='$size' class="rider-input input-350" type="datetimerange" align="right"
                                unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions2" v-model='time'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='审核状态:'>
                            <el-select class='rider-input margin-right-20' :size='$size' v-model="formData.authStatus">
                                <el-option v-for='(item,index) in radio' :key='index' :value='item.label' :label='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label=' '>
                            <el-button :size='$size' class='rider-btn submit' @click='getList()'>搜索</el-button>
                            <el-button :size='$size' class='rider-btn cancel' @click='reset()'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table label='100px' header-row-class-name='thead' fit :data='tableData' :size='$size' v-loading='loading'
                element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column label='序号' width='80' type='index' :index='function(index){return (formData.page-1)*formData.limit+(index+1)}'></el-table-column>
                <el-table-column label='用户ID' min-width='170' prop='userId'>
                </el-table-column>
                <el-table-column label='申请时间' min-width='100'>
                    <template slot-scope='scope'>
                        <div>{{scope.row.createdAt|formatTime('YYYY-MM-DD')}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-for='(item,index) in tableInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width="item.width"></el-table-column>
                <el-table-column label='发证城市' min-width='100' v-if='cardType=="health"'>
                    <template slot-scope='scope'>
                        <div>{{scope.row.cityCode|getCityName}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="发证日期" min-width='100' v-if='cardType=="health"'>
                    <template slot-scope='scope'>
                        <div>{{scope.row.issueData|formatTime('YYYY-MM-DD')}}</div>
                    </template>
                </el-table-column>
                <el-table-column label='过期时间' min-width='100'>
                    <template slot-scope='scope'>
                        <div>{{scope.row.validAt|formatTime('YYYY-MM-DD')}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" min-width='80'>
                    <template slot-scope='scope'>
                        <div>{{scope.row.authStatus|AuthStatus}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width='100'>
                    <template slot-scope='scope'>
                        <div @click='openCheckDialog(scope.row)'>
                            <el-button :size='$size' type='primary' v-if='scope.row.authStatus=="SUBMIT"'>审核</el-button>
                            <el-button :size='$size' v-else>查看用户信息</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <user-info :show.sync='openDetail' :item='detailItem'></user-info>
        <check-result :show.sync='openCheck' :item='checkItem' @success='getList()'></check-result>
        <health-check :show.sync='openHealthCheck' :item='checkItem' @success='getList()'></health-check>
        <Pagination @page='getPage' :form='formData' :total='total'></Pagination>
    </div>
</template>
<script>
import UserInfo from "./../../../components/user/UserInfoDisplay";
import CheckResult from "./../../../components/user/IDcheck";
import HealthCheck from "./../../../components/user/HealthCheck";
import AutoDeal from "./../../../components/AutoDeal";
import { datePickerOption } from "./../../../util/publicParams.js";
// import { mapActions } from "vuex";
import moment from "moment";
import {
    checkIDList,
    checkHealthList,
    checkID,
    checkHealth,
    autoCheckIDDetail,
    autoCheckHealthDetail,
    canUse
} from "./../../../menu/permission.js";
export default {
    components: {
        UserInfo,
        CheckResult,
        HealthCheck,
        AutoDeal
    },
    data() {
        let radio = JSON.parse(localStorage.getItem("authStatus"));
        let tableInfoID = [
            { label: "用户姓名", prop: "realName", width: "100" },
            { label: "手机号码", prop: "phone", width: "100" },
            { label: "身份证号码", prop: "idCardNum", width: "120" }
        ];
        let tableInfoHealth = [
            { label: "用户姓名", prop: "realName", width: "100" },
            { label: "手机号码", prop: "phone", width: "100" },
            { label: "健康证号码", prop: "cardNum", width: "120" }
        ];
        return {
            checkIDList,
            checkHealthList,
            autoCheckIDDetail,
            autoCheckHealthDetail,
            cardType: this.$route.query.q || (checkIDList ? "ID" : "health"),
            radio,
            tableInfoID,
            tableInfoHealth,
            tableInfo: tableInfoID,
            openDetail: false,
            openCheck: false,
            openHealthCheck: false,
            checkItem: {},
            detailItem: {},
            autoForm: { auto: false, time: "", choose: "1", reason: "" },
            pickerOptions2: datePickerOption,
            formData: {
                phone: "",
                realName: "",
                riderId: "",
                authStatus: "",
                page: 1,
                limit: 10
            },
            time: [],
            tableData: [],
            tabName: this.$route.query.q || (checkIDList ? "ID" : "health"),
            radioValue: "1",
            api: this.$api.checkIDlist,
            total: 0,
            loading: false
        };
    },
    watch: {
        tabName(val) {
            this.cardType = val;
            if (val == "ID") {
                this.api = this.$api.checkIDlist;
                this.tableInfo = this.tableInfoID;
            } else if (val == "health") {
                this.api = this.$api.checkHealthList;
                this.tableInfo = this.tableInfoHealth;
            }
            this.getList();
        }
    },
    // created() {
    // this.getAutoStatus("IDCARD_AUTO_AUTH");
    // },
    methods: {
        // ...mapActions({
        //     getAutoStatus: "auto/getAutoStatus"
        // }),
        switchTab(tab) {
            this.tabName = tab;
        },
        // openDialog(item) {
        //     this.openDetail = true;
        //     console.log(item);
        //     this.detailItem = item;
        // },
        openCheckDialog(item) {
            if (this.tabName == "ID") {
                if (!canUse("checkID")) return;
                // if (!checkID) {
                //     this.$message.error("没有权限");
                //     return;
                // }
                this.openCheck = true;
            } else if (this.tabName == "health") {
                if (!canUse("checkHealth")) return;
                // if (!checkHealth) {
                //     this.$message.error("没有权限");
                //     return;
                // }
                this.openHealthCheck = true;
            }
            this.checkItem = item;
        },
        getPage(val) {
            console.log(val);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            // this.formData.page = val.page;
            // this.formData.limit = val.limit;
            this.getList();
        },
        mTime() {
            if (this.time.length > 0) {
                let start = this.time[0];
                let end = this.time[1];
                let startAt = moment(start).format("X");
                let endAt = moment(end).format("X");
                return { startAt, endAt };
            } else {
                return {};
            }
        },
        getList() {
            this.loading = true;
            let mtime = this.mTime();
            this.$http
                .get(this.api, { ...this.formData, ...mtime }, true)
                .then(res => {
                    console.log("TCL: getList -> res", res);
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
        reset() {
            this.formData = { authStatus: "", page: 1, limit: 10 };
            this.time = [];
            this.getList();
        }
    }
};
</script>