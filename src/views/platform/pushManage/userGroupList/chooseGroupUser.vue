<style lang="scss" scoped src='./chooseGroupUser.scss'></style>
<template>
    <div class="choose-group-user">
        <el-form label-width='100px'>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="用户ID:">
                        <el-input :size='$size'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户手机号:">
                        <el-input :size='$size'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户姓名:">
                        <el-input :size='$size'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size='$size' type='primary'>搜索</el-button>
                <el-button :size='$size'>重置</el-button>
            </div>
        </el-form>
        <el-table :data='fake' :size='$size'>
            <el-table-column type='selection' width="55" v-if='showSelector'></el-table-column>
            <el-table-column v-for='(item,index) in tableInfo' :key='index' :label='item.label' :prop='item.prop'></el-table-column>
            <el-table-column label='基本信息'>
                <template slot-scope='scope'>
                    <div>查看</div>
                </template>
            </el-table-column>
            <el-table-column label='订单列表'>
                <template slot-scope='scope'>
                    <div>查看</div>
                </template>
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope='scope'>
                    <div>删除</div>
                </template>
            </el-table-column>
        </el-table>
        <div v-if='showSelector'>已选择0人</div>
        <el-button :size='$size' type='primary' v-if='showSelector'>确认</el-button>
    </div>
</template>
<script>
let tableInfo = [
    { label: "序号", prop: "", width: "" },
    { label: "用户ID", prop: "id", width: "" },
    { label: "用户角色", prop: "", width: "" },
    { label: "用户姓名", prop: "", width: "" },
    { label: "手机号码", prop: "", width: "" },
    { label: "身份证号码", prop: "", width: "" },
    { label: "健康证号码", prop: "", width: "" },
    { label: "是否关联商户", prop: "", width: "" },
    { label: "商户名称", prop: "", width: "" }
];
export default {
    data() {
        return {
            tableInfo,
            fake: [{ id: 12321321 }, { id: "18y67" }],
            showSelector: true
        };
    },
    created() {
        this.disableChoose();
    },
    methods: {
        disableChoose() {
            let query = this.$route.query;
            console.log(query);
            if (query && query.type && query.type == "disableChoose") {
                this.showSelector = false;
            }
        }
    }
};
</script>


