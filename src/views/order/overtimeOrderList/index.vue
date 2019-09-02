<template>
    <div class="rider-container overtime">
        <div class="rider-switch">
            <div class="tab active">超时订单</div>
        </div>
        <!-- <auto-deal :autoType='{type:"TWO_EXCEPTION_ORDER_AUTO_DISPATCH"}'></auto-deal> -->
        <div class="rider-search">
            <h1 class="title">超时监管订单列表</h1>
            <el-form :size='$size' label-width="100px">
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='订单ID：'>
                            <el-input class="rider-input" :size="$size" placeholder="请输入订单ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='超时时间：'>
                            <el-input class="rider-input input-100" :size="$size" placeholder="起始"></el-input>
                            <span class="margin-left-10 margin-right-10" style='color:#fff'>至</span>
                            <el-input class="rider-input input-100" :size="$size" placeholder="结束"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='8'>
                        <el-form-item label='订单状态：'>
                            <el-select :size='$size' placeholder="请选择订单状态" class="rider-input">
                                <el-option v-for='item in orderStatus' :key='item.value' :label="item.label" :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='订单类型：'>
                            <el-select :size='$size' placeholder="请选择订单类型" class="rider-input">
                                <el-option v-for='item in orderType' :key='item.value' :label="item.label" :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label=" ">
                            <el-button class="rider-btn submit">搜索</el-button>
                            <el-button class="rider-btn cancel">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table :size='$size' :data='tableData'     v-loading="loading"
                element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column label='订单ID' prop='id' min-width='120'></el-table-column>
                <el-table-column label='超时时间' prop='' min-width='120'></el-table-column>
                <el-table-column label='派单时间' prop='' min-width='120'></el-table-column>
                <el-table-column label='骑士名称' prop='' min-width='100'></el-table-column>
                <el-table-column label='骑士手机号' prop='' min-width='120'></el-table-column>
                <el-table-column label='订单状态' prop='' min-width='120'></el-table-column>
                <el-table-column label='订单类型' prop='' min-width='120'></el-table-column>
                <el-table-column label='配送费' prop='' min-width='100'></el-table-column>
                <el-table-column label='商家电话' prop='' min-width='120'></el-table-column>
                <el-table-column label='取货地址' prop='' min-width='120'></el-table-column>
                <el-table-column label='客户电话' prop='' min-width='120'></el-table-column>
                <el-table-column label='配送地址' prop='' min-width='120'></el-table-column>
                <el-table-column label='处理状态' prop='' min-width='100'></el-table-column>
                <el-table-column label='操作' prop='' min-width='120'></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import AutoDeal from "./../../../components/AutoDeal";
export default {
    components: { AutoDeal },
    data() {
        let orderStatus = [
            { label: "全部", value: "" },
            { label: "待取货", value: "1" },
            { label: "配送中", value: "2" }
        ];
        let orderType = JSON.parse(localStorage.getItem("orderType"));
        return {
            orderStatus,
            orderType,
            tableData: [{ id: 1 }],
            loading: false
        };
    }
};
</script>
