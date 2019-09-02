<template>
    <div class="withdraw-record rider-container">
        <div class="rider-switch">
            <div class="tab active">全部</div>
        </div>
        <div class="rider-search">
            <el-form label-width="100px">
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='提现单号:'>
                            <el-input class="rider-input margin-right-20 input-250" :size='$size' placeholder="输入提现单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='到账日期:'>
                            <el-date-picker class='rider-input input-350 margin-right-20' v-model="dateValue" type="datetimerange"
                                align="right" unlink-panels range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" :picker-options="pickerOptions2" :size='$size'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label=' '>
                            <el-button :size="$size" class='rider-btn submit'>搜索</el-button>
                            <el-button class='rider-btn cancel' :size='$size'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table :size='$size'     fit :data='tableData'>
                <el-table-column label='提现单号' prop='id' min-width='120'></el-table-column>
                <el-table-column label='提现时间' prop='' min-width='120'></el-table-column>
                <el-table-column label='骑士ID' prop='' min-width='120'></el-table-column>
                <el-table-column label='用户姓名' prop='' min-width='120'></el-table-column>
                <el-table-column label='手机号码' prop='' min-width='120'></el-table-column>
                <el-table-column label='账户余额' prop='' min-width='120'></el-table-column>
                <el-table-column label='提现金额' prop='' min-width='120'></el-table-column>
                <el-table-column min-width='120' fixed='right' label='操作'>
                    <template slot-scope='scope'>
                        <div class="text-blue point-style" @click='openDialog(scope.row.id)'>查看详情</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <withdraw-detail :show.sync='openDetail' :isChecked='true'></withdraw-detail>
        <Pagination :total='total' @page='getPage' :form='fromData'></Pagination>
    </div>
</template>
<script>
import WithdrawDetail from "./../../../components/finance/WithdrawCheckDialog";
import { datePickerOption } from "./../../../util/publicParams.js";
export default {
    components: {
        WithdrawDetail
    },
    data() {
        return {
            tableData: [{ id: 1 }],
            pickerOptions2: datePickerOption,
            dateValue: "",
            openDetail: false,
            formData: { page: 1, limit: 10 },
            total: 0
        };
    },
    methods: {
        getList() {},
        getPage(val) {
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        openDialog(id) {
            this.openDetail = true;
            console.log(id);
        }
    }
};
</script>
