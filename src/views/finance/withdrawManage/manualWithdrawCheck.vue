<template>
    <div class="withdraw-check rider-container">
        <div class="rider-switch">
            <div class="tab" :class="{active:tabName=='submit'}" @click='switchTab("submit")'>未审核</div>
            <div class="tab" :class="{active:tabName=='success'}" @click='switchTab("success")'>待确认</div>
            <div class="tab" :class="{active:tabName=='confirm'}" @click='switchTab("confirm")'>提现成功</div>
            <div class="tab" :class="{active:tabName=='fail'}" @click='switchTab("fail")'>提现失败</div>
        </div>
        <keep-alive>
            <auto-deal v-if='tabName=="submit"' :autoType='{type:"DRAW_MONEY_AUTO_AUTH"}'></auto-deal>
        </keep-alive>
        <div class="rider-search">
            <h1 class="title">提现列表</h1>
            <el-form label-width="100px" :inline="true">
                <el-row>
                    <el-col :span='6'>
                        <el-form-item label='提现单号:'>
                            <el-input :size='$size' class="rider-input input-250 margin-right-20" v-model="formData.orderNo"
                                placeholder="输入提现单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='7'>
                        <el-form-item label='申请日期 :'>
                            <el-date-picker class="rider-input input-350 margin-right-20" type="datetimerange" align="right"
                                unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions2" :size="$size" v-model='time'></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='6'>
                        <el-form-item label=' '>
                            <el-button class="rider-btn" type='primary' @click='getList'>搜索</el-button>
                            <el-button class='rider-btn cancel' :size='$size' @click='reset'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <div class="rider-table-btn-group" v-if='tabName=="submit"'>
                <el-button class='rider-btn submit' :disabled="chooseIDs.length==0" @click='checkManySucc'>批量通过</el-button>
                <el-button class='rider-btn cancel' :disabled="chooseIDs.length==0" @click="checkManyFail">批量不通过</el-button>
            </div>
            <el-table :size='$size' fit :data='tableData' @selection-change="handleSelectionChange" v-loading="loading"
                element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column type="selection" width='80' v-if='tabName=="submit"'></el-table-column>
                <el-table-column label="提现单号" prop='orderNo' min-width='150'></el-table-column>
                <el-table-column label="申请日期" prop='updatedAt' width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.updatedAt|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="骑士ID" prop='userId' min-width='170'></el-table-column>
                <el-table-column label="用户姓名" prop='realName' min-width='120'></el-table-column>
                <el-table-column label="手机号码" prop='phone' min-width='120'></el-table-column>
                <el-table-column label="账户余额" prop='balance' min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.balance|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label="提现金额" prop='amount' min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.amount|formatPrice}}
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" prop='drawStatus' min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.drawStatus|checkType}}
                    </template>
                </el-table-column>
                <el-table-column label='操作' min-width='120'>
                    <template slot-scope='scope'>
                        <div v-if='showOperate'>
                            <el-button :size='$size' type='primary' v-if='scope.row.drawStatus=="submit"' @click='openCheckDialog(scope.row)'>审核</el-button>
                            <el-button :size='$size' type='primary' v-else-if="scope.row.drawStatus=='success'" @click='openCheckDialog(scope.row)'>提现确认</el-button>
                            <el-button :size='$size' class="cancel" v-else @click='openCheckDialog(scope.row)'>查看详情</el-button>
                        </div>
                        <div v-else>无操作权限</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :total='total' @page='getPage' :form='formData'></Pagination>
        <withdraw-check :show.sync='openCheck' :status='tabName' :checkType='checkType' :item="checkItem" @success='getList()'></withdraw-check>
    </div>
</template>
<script>
import WithdrawCheck from "./../../../components/finance/WithdrawCheckDialog";
import AutoDeal from "./../../../components/AutoDeal";
import { datePickerOption, checkType } from "./../../../util/publicParams.js";
import mixin from "./../../../components/finance/CheckConfirmMixin.js";
import moment from "moment";
import {
    canUse,
    withdrawDetail,
    withdrawCheck,
    withdrawConfirm
} from "./../../../menu/permission.js";
export default {
    mixins: [mixin],
    components: {
        WithdrawCheck,
        AutoDeal
    },
    data() {
        return {
            withdrawDetail,
            withdrawCheck,
            withdrawConfirm,
            checkType,
            openCheck: false,
            tableData: [],
            autoForm: { choose: "0" },
            tabName: "submit",
            pickerOptions2: datePickerOption,
            multipleSelection: [],
            formData: { drawStatus: "submit", page: 1, limit: 10 },
            total: 0,
            loading: false,
            time: [],
            btnLoading: false,
            checkItem: {}
        };
    },
    computed: {
        chooseIDs() {
            return this.multipleSelection.map(item => item.id);
        },
        newTime() {
            if (this.time.length == 2) {
                return {
                    startTime: moment(this.time[0]).format("X"),
                    endTime: moment(this.time[1]).format("X")
                };
            } else {
                return {};
            }
        },
        showOperate() {
            let show = false;
            if (this.tabName == "submit" && this.withdrawCheck) {
                show = true;
            } else if (this.tabName == "success" && this.withdrawConfirm) {
                show = true;
            } else if (
                (this.tabName == "confirm" || this.tabName == "fail") &&
                this.withdrawDetail
            ) {
                show = true;
            }
            return show;
        }
    },
    watch: {
        tabName() {
            this.getList();
        }
    },
    filters: {
        checkType(val) {
            for (let i of checkType) {
                if (i.value == val) {
                    return i.label;
                }
            }
        }
    },
    methods: {
        getList() {
            this.loading = true;
            let data = {
                ...this.formData,
                ...this.newTime
            };
            this.$http
                .get(this.$api.financeCheckList, data, true)
                .then(res => {
                    console.table("TCL: getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                    this.$message.error("获取失败 错误码:" + err.code);
                    this.tableData = [];
                });
        },
        switchTab(tab) {
            this.tabName = tab;
            this.formData = { page: 1, limit: 10 };
            this.formData.drawStatus = tab;
        },
        openCheckDialog(item) {
            this.openCheck = true;
            this.checkItem = item;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 审核
        checkManySucc() {
            this.$confirm("确认批量通过审核?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(res => {
                this.checkItems(
                    {
                        ids: this.chooseIDs,
                        authMessage: "",
                        drawStatus: "success"
                    },
                    () => {
                        this.getList();
                    }
                );
            });
        },
        checkManyFail() {
            this.$prompt("批量审核:不通过", "不通过原因", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputPlaceholder: "审核不通过原因"
            }).then(value => {
                this.checkItems(
                    {
                        ids: this.chooseIDs,
                        authMessage: value.value,
                        drawStatus: "fail"
                    },
                    () => {
                        this.getList();
                    }
                );
            });
        },
        getPage(val) {
            this.formData = {
                ...val.form,
                limit: val.limit,
                page: val.page
            };
            this.tabName = val.form.drawStatus;
            this.getList();
        },
        reset() {
            // this.formData = { drawStatus: "submit", limit: 10, page: 1 };
            this.formData = { ...this.formData, limit: 10, page: 1 };
            // this.tabName = "submit";
            this.time = [];
            this.getList();
        }
    }
};
</script>
