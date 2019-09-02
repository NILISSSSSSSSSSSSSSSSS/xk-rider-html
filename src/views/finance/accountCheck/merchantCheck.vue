<template>
    <div class="merchant-check rider-container">
        <div class="rider-switch">
            <div class="tab active">商户对账</div>
            <div class="tab">自营商城对账</div>
        </div>
        <div class="rider-search">
            <el-form label-width="100px" class="line-flex-start" :inline="true">
                <el-form-item label='关键字:'>
                    <el-input class="rider-input margin-right-20" :size='$size' placeholder="输入对账编号 / 订单ID / 商户名称"></el-input>
                </el-form-item>

                <el-form-item label='查询日期：'>
                    <el-date-picker class='rider-input input-250 margin-right-20' v-model="dateValue" type="daterange"
                        align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        :picker-options="pickerOptions2" :size='$size'>
                    </el-date-picker>
                </el-form-item>
                <el-button :size='$size' class="rider-btn submit">搜索</el-button>
                <el-button class='rider-btn cancel' :size='$size'>重置</el-button>
            </el-form>
        </div>
        <div class='rider-table'>
            <el-table :data='fake'     fit :size='$size'>
                <el-table-column v-for='(item,index) in tableInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width='item.width'></el-table-column>
                <el-table-column fixed='right' label='订单记录' width='120'>
                    <template slot-scope='scope'>
                        <div class='text-blue point-style'>查看</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination></Pagination>
    </div>
</template>
<script>
let tableInfo = [
    { label: "对账单号", prop: "", width: "120" },
    { label: "订单ID", prop: "id", width: "120" },
    { label: "商品类型", prop: "id", width: "120" },
    { label: "商品来源", prop: "id", width: "120" },
    { label: "商户名称", prop: "id", width: "120" },
    { label: "联系方式", prop: "id", width: "120" },
    { label: "订单状态", prop: "id", width: "120" },
    { label: "完成时间", prop: "id", width: "120" },
    { label: "配送骑士", prop: "id", width: "120" },
    { label: "商户支付运费", prop: "id", width: "120" }
];
import { datePickerOption } from "./../../../util/publicParams.js";
export default {
    data() {
        return {
            tableInfo,
            fake: [{ id: 1 }, { id: 2 }],
            pickerOptions2: datePickerOption,
            dateValue: ""
        };
    }
};
</script>
<style lang="scss" scoped>
</style>
