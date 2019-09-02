<template>
    <div class="log rider-container">
        <div class="rider-switch">
            <div class="tab active">日志列表</div>
        </div>
        <div class="rider-search">
            <el-form label-width="100px" :inline="true">
                <el-form-item label='关键字:'>
                    <el-input :size='$size' class="rider-input margin-right-20" placeholder="输入操作者姓名 / 账号" v-model='formData.key'></el-input>
                </el-form-item>
                <el-form-item label='角色 :'>
                    <el-select :size='$size' class="rider-input margin-right-20" v-model='formData.roleId'>
                        <el-option v-for='(item,index) in roleOption' :key='index' :value='item.id' :label='item.name'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button :size='$size' class="rider-btn" type='primary' @click='getList()'>搜索</el-button>
                    <el-button :size='$size' class="rider-btn cancel" @click='reset()'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table :size='$size' :data='tableData' v-loading='loading' element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column label='序号' type='index' :index='function(index){return (formData.page-1)*formData.limit+index+1}'
                    width='100'></el-table-column>
                <el-table-column label='操作者' prop='realName' min-width='120'></el-table-column>
                <el-table-column label='操作账号' prop='phone' min-width='120'></el-table-column>
                <el-table-column label='角色' prop='roleName' min-width='120'></el-table-column>
                <el-table-column label='IP地址' prop='ip' min-width='120'></el-table-column>
                <el-table-column label='操作时间' prop='' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.operateAt|formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label='操作动作' prop='content' min-width='300'></el-table-column>
            </el-table>
        </div>
        <Pagination :form='formData' :total='total' @page='getPage'></Pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            roleOption: [],
            roleValue: "1",
            formData: { limit: 10, page: 1 },
            tableData: [],
            loading: false,
            total: 0
        };
    },
    created() {
        this.getRoleList();
    },
    methods: {
        getRoleList() {
            this.$http
                .get(
                    this.$api.permissionRoleList,
                    { limit: 1000, page: 1 },
                    true
                )
                .then(res => {
                    console.log("​getRoleList -> res", res);
                    this.roleOption = res.data;
                })
                .catch(err => {
                    this.$message.error("获取角色失败");
                });
        },
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.permissionLog, this.formData, true)
                .then(res => {
                    console.log("​getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    this.loading = false;
                });
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        reset() {
            this.formData = { limit: 10, page: 1 };
            this.getList();
        }
    }
};
</script>
