
<template>
    <div class="user-list-record rider-container">
        <div class="rider-switch">
            <div class="tab active">骑士姓名</div>
        </div>
        <div class="rider-search">
            <el-form :inline="true" label-width="120px">
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label="订单ID/子单ID:">
                            <el-input class=" rider-input" :size='$size' placeholder="输入订单ID / 子订单ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label="接单时间:">
                            <el-date-picker class="rider-input input-250" type="datetimerange" :picker-options="pickerOptions2"
                                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" :size='$size'>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label="异常等级:">
                            <el-select class="rider-input" :size='$size'>
                                <el-option v-for='(item,index) in error' :key='index' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label="订单状态:">
                            <el-select class="rider-input" :size='$size'>
                                <el-option v-for='(item,index) in orderStatus' :key='index' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label="订单类型:">
                            <el-select class="rider-input" :size='$size'>
                                <el-option v-for='(item,index) in XKModule' :key='index' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label="商品类型:">
                            <el-select class="rider-input" :size='$size'>
                                <el-option v-for='(item,index) in orderType' :key='index' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label=' '>
                            <el-button class="rider-btn submit">搜索</el-button>
                            <el-button class="rider-btn cancel">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table fit :size='$size'>
                <el-table-column label='订单ID' prop='' min-width='120'></el-table-column>
                <el-table-column label='异常等级' prop='' min-width='120'></el-table-column>
                <el-table-column label='订单状态' prop='' min-width='120'></el-table-column>
                <el-table-column label='订单类型' prop='' min-width='120'></el-table-column>
                <el-table-column label='商品类型' prop='' min-width='120'></el-table-column>
                <el-table-column label='配送费' prop='' min-width='120'></el-table-column>
                <el-table-column label='所属区域' prop='' min-width='120'></el-table-column>
                <el-table-column label='接单时间' prop='' min-width='120'></el-table-column>
                <el-table-column label='取货时间' prop='' min-width='120'></el-table-column>
                <el-table-column label='转单时间' prop='' min-width='120'></el-table-column>
                <el-table-column label='送达时间' prop='' min-width='120'></el-table-column>
                <el-table-column label='取消时间' prop='' min-width='120'></el-table-column>
                <el-table-column label='操作' prop='' min-width='120'></el-table-column>
            </el-table>
        </div>
        <Pagination></Pagination>
    </div>
</template>

<script>
import { datePickerOption } from "./../../../util/publicParams.js";

export default {
    data() {
        let error = [
            { label: "全部", value: "" },
            { label: "0级", value: "0" },
            { label: "1级", value: "1" },
            { label: "2级", value: "2" }
        ];
        let orderStatus = JSON.parse(localStorage.getItem("orderStatus"));
        let XKModule = JSON.parse(localStorage.getItem("XKModule"));
        let orderType = JSON.parse(localStorage.getItem("orderType"));
        return {
            error,
            orderStatus,
            XKModule,
            orderType,
            pickerOptions2: datePickerOption,
            formData: {
                id: "",
                select: "",
                time: ""
            }
        };
    },
    methods: {
        search() {
            this.$message.success(JSON.stringify(this.formData));
        }
    },
    mounted() {
        console.log("key", this.pageKey);
    }
};
</script>
<style lang="scss">
.user-list-record {
    width: 100%;
}
</style>

