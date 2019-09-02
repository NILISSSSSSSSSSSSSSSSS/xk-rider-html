<template>
    <div class="refuse-order-detail rider-container">
        <div class="rider-switch">
            <div class="tab active">
                状态显示
            </div>
            <div class="close-form-btn">
                <div class="text-blue point-style" @click="$router.go(-1)">
                    返回上一级
                </div>
            </div>
        </div>
        <div class="rider-table">
            <!-- ======================= -->
            <h1 class="title">订单信息</h1>
            <el-table :size='$size' :data='fake'     fit>
                <el-table-column v-for='(item,index) in orderInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width='item.width'></el-table-column>
            </el-table>
            <!-- ====================== -->
            <h1 class="title">配送信息</h1>
            <el-table :size='$size' :data='fake'     fit>
                <el-table-column v-for='(item,index) in deliveryInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width='item.width'></el-table-column>
            </el-table>
            <!-- ======================= -->
            <h1 class="title">商户信息</h1>
            <el-table :size='$size' :data='fake'     fit>
                <el-table-column v-for='(item,index) in merchantInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width='item.width'></el-table-column>
            </el-table>
            <!-- ====================== -->
            <h1 class="title">用户信息</h1>
            <el-table :size='$size' :data='fake'     fit>
                <el-table-column v-for='(item,index) in userInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width='item.width'></el-table-column>
            </el-table>
            <!-- ======================= -->
            <h1 class="title">商品信息</h1>
            <el-table :size='$size' :data='fake'     fit>
                <el-table-column v-for='(item,index) in productInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width='item.width'></el-table-column>
            </el-table>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        // 订单信息
        let orderInfo = [
            { label: "订单ID", prop: "", width: "120" },
            { label: "订单状态", prop: "id", width: "120" },
            { label: "订单类型", prop: "id", width: "120" },
            { label: "派单时间", prop: "", width: "120" },
            { label: "配送金额", prop: "", width: "120" },
            { label: "异常等级", prop: "", width: "120" },
            { label: "支付方式", prop: "", width: "120" },
            { label: "预计配送时间", prop: "", width: "120" },
            { label: "转单次数", prop: "", width: "120" }
        ];
        // 配送信息
        let deliveryInfo = [
            { label: "订单/子订单ID", prop: "id", width: "120" },
            { label: "骑手名称", prop: "id", width: "120" },
            { label: "骑手ID", prop: "", width: "120" },
            { label: "骑手手机号", prop: "", width: "120" },
            { label: "接单时间", prop: "", width: "120" },
            { label: "配送金额", prop: "", width: "120" },
            { label: "转单时间", prop: "", width: "120" }
        ];
        // 商户信息
        let merchantInfo = [
            { label: "商户名称", prop: "id", width: "120" },
            { label: "取货地址", prop: "", width: "120" },
            { label: "商户负责人", prop: "", width: "120" },
            { label: "联系方式", prop: "", width: "120" },
            { label: "备注信息", prop: "", width: "120" }
        ];
        // 用户信息
        let userInfo = [
            { label: "用户名", prop: "id", width: "120" },
            { label: "配送地址", prop: "", width: "120" },
            { label: "联系方式", prop: "", width: "120" },
            { label: "备注信息", prop: "", width: "120" }
        ];
        // 商品信息
        let productInfo = [
            { label: "商品ID", prop: "id", width: "120" },
            { label: "防伪编码", prop: "", width: "120" },
            { label: "商品图片", prop: "", width: "120" },
            { label: "商品名称", prop: "", width: "120" },
            { label: "商品类型", prop: "", width: "120" },
            { label: "数量", prop: "", width: "120" },
            // { label: "商品分类", prop: "", width: "120" },
            { label: "规格", prop: "", width: "120" },
            { label: "品牌", prop: "", width: "120" },
            { label: "重量", prop: "", width: "120" },
            { label: "单价", prop: "", width: "120" }
        ];
        return {
            orderInfo,
            deliveryInfo,
            merchantInfo,
            userInfo,
            productInfo,
            fake: [{ id: 123 }]
        };
    }
};
</script>
<style lang="scss" scoped>
.refuse-order-detail {
    .title {
        line-height: 70px;
        color: #fff;
        padding-left: 10px;
    }
}
</style>
