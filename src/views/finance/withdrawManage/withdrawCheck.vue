<template>
    <div class="withdraw-check rider-container">
        <div class="rider-switch">
            <div class="tab" :class="{active:tabName=='checked'}" @click='switchTab("checked")'>未审核</div>
            <div class="tab " :class="{active:tabName=='failed'}" @click='switchTab("failed")'>未通过</div>
            <div class="tab " :class="{active:tabName=='success'}" @click='switchTab("success")'>已通过</div>
        </div>
        <!-- <auto-deal v-if='tabName=="checked"' :autoType='{type:"IDCARD_AUTO_AUTH"}'></auto-deal> -->
        <div class="rider-search">
            <h1 class="title">提现列表</h1>
            <el-form label-width="100px" :inline="true">
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='提现单号:'>
                            <el-input :size='$size' class="rider-input input-250 margin-right-20" placeholder="输入提现单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='到账日期 :'>
                            <el-date-picker class="rider-input input-350 margin-right-20" type="datetimerange" align="right"
                                unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="pickerOptions2" :size="$size"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label=' '>
                            <el-button class="rider-btn" type='primary'>搜索</el-button>
                            <el-button class='rider-btn cancel' :size='$size'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>
        <div class="rider-table">
            <div class="rider-table-btn-group">
                <el-button class='rider-btn submit'>批量通过</el-button>
                <el-button class='rider-btn cancel'>批量不通过</el-button>
            </div>
            <el-table     :size='$size' fit :data='tableData'
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width='80'></el-table-column>
                <el-table-column label="提现单号" prop='id' min-width='120'></el-table-column>
                <el-table-column label="申请日期" prop='' min-width='120'></el-table-column>
                <el-table-column label="骑士ID" prop='' min-width='120'></el-table-column>
                <el-table-column label="用户姓名" prop='' min-width='120'></el-table-column>
                <el-table-column label="手机号码" prop='' min-width='120'></el-table-column>
                <el-table-column label="账户余额" prop='' min-width='120'></el-table-column>
                <el-table-column label="提现金额" prop='' min-width='120'></el-table-column>
                <el-table-column label="审核状态" prop='' min-width='120'></el-table-column>
                <el-table-column fixed="right" label='操作' min-width='120'>
                    <template slot-scope='scope'>
                        <el-button :size='$size' type='primary' @click='openCheckDialog(scope.row.id)'>审核</el-button>
                        <el-button :size='$size' class="cancel">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :total='total' @page='getPage' :form='formData'></Pagination>
        <withdraw-check :show.sync='openCheck'></withdraw-check>
    </div>
</template>
<script>
import WithdrawCheck from "./../../../components/finance/WithdrawCheckDialog";
import AutoDeal from "./../../../components/AutoDeal";
import { datePickerOption } from "./../../../util/publicParams.js";
export default {
    components: {
        WithdrawCheck,
        AutoDeal
    },
    data() {
        return {
            openCheck: false,
            tableData: [{ id: 222, name: 123 }, { id: 11441, name: 123 }],
            autoForm: { choose: "0" },
            tabName: "checked",
            pickerOptions2: datePickerOption,
            multipleSelection: [],
            formData: { page: 1, limit: 10 },
            total: 0
        };
    },
    computed: {
        chooseIDs() {
            return this.multipleSelection.map(item => item.id);
        }
    },
    methods: {
        getList() {},
        switchTab(tab) {
            this.tabName = tab;
        },
        openCheckDialog(id) {
            this.openCheck = true;
            console.log(id);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        passItems() {},
        passOne() {},
        passSome() {},
        getPage(val) {
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        }
    }
};
</script>
