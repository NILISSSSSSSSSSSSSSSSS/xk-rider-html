<style lang="scss" scoped src='./index.scss'></style>
<template>
    <div class="user-group-list">
        <router-link to='/addUserGroup'>新增用户组</router-link>
        <el-form label-width="100px">
            <el-row>
                <el-col :span='8'>
                    <el-form-item label='用户组ID:'>
                        <el-input :size='$size'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='8'>
                    <el-form-item label='用户组名称:'>
                        <el-input :size='$size'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button
                    :size='$size'
                    type='primary'
                >搜索</el-button>
                <el-button :size='$size'>重置</el-button>
            </div>
        </el-form>
        <el-table :data="fake" :size='$size'>
            <el-table-column
                v-for='(item,index) in tableInfo'
                :key='index'
                :label='item.label'
                :prop='item.prop'
            ></el-table-column>
            <el-table-column label='用户列表'>
                <template slot-scope='scope'>
                    <div
                        style='cursor:pointer'
                        @click='toUserList(scope.row.id)'
                    >查看</div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间">
            </el-table-column>
            <el-table-column label='操作'>
                <template slot-scope='scope'>
                    <div>
                        <el-button
                            :size='$size'
                            type='primary'
                            @click='toAddGroup(scope.row.id)'
                        >编辑</el-button>
                        <el-button :size='$size'>删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
let tableInfo = [
    { label: "序号", prop: "", width: "" },
    { label: "用户组ID", prop: "id", width: "" },
    { label: "组名称", prop: "", width: "" },
    { label: "用户组描述", prop: "", width: "" }
];
export default {
    data() {
        return {
            tableInfo,
            fake: [{ id: 123213 }, { id: 120321 }, { id: 123213 }]
        };
    },
    methods: {
        toAddGroup(id) {
            this.$router.push({
                name: "addUserGroup",
                params: { type: "edit", id: id }
            });
        },
        toUserList(id) {
            this.$router.push({
                path: "/chooseGroupUser", //复用
                query: { type: "disableChoose", id: id }
            });
        }
    }
};
</script>


