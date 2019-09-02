<template>
    <div class="platform-user rider-container">
        <div class="rider-switch">
            <div class='tab' :class="{active:tabName=='all'}" @click='switchTab("all")'>全部用户</div>
            <div class='tab' :class="{active:tabName=='freeze'}" @click='switchTab("freeze")'>已冻结用户</div>
        </div>
        <div class="rider-search">
            <el-form label-width="100px">
                <div class="line-flex-start">
                    <div class='line-space-between'>
                        <el-input class="rider-input margin-right-20" placeholder="输入骑士ID / 手机号 / 姓名" :size='$size'></el-input>
                        <el-button :size='$size' class="rider-btn submit">搜索</el-button>
                    </div>
                    <el-form-item label='用户角色:'>
                        <el-select v-model='select' :size='$size' class='rider-input margin-right-20'>
                            <el-option label='区域管理员' value='1'></el-option>
                        </el-select>
                        <el-button :size='$size' type='warning' class='rider-btn cancel'>重置</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="rider-table">
            <div class="rider-table-btn-group">
                <el-button class='rider-btn submit'>批量激活</el-button>
                <el-button class='rider-btn cancel'>批量冻结</el-button>
            </div>
            <el-table header-row-class-name='thead' fit :data='fake' :size='$size'>
                <el-table-column type='selection' width="82"></el-table-column>
                <el-table-column v-for='(item,index) in tableInfo' :key='index' :label='item.label' :prop='item.prop'
                    :min-width="item.width"></el-table-column>
                <el-table-column label="基本资料" width='120'>
                    <template slot-scope='scope'>
                        <div class='text-blue point-style' @click='openDialog(scope.row.id)'>查看</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单列表" width='120'>
                    <template slot-scope='scope'>
                        <div class='text-blue point-style'>查看</div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width='120' fixed='right'>
                    <template slot-scope='scope'>
                        <div>
                            <el-button type="primary" :size='$size' v-if='scope.row.id%2==0'>激活</el-button>
                            <el-button type="danger" :size='$size' v-else>冻结</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <el-dialog
            title='用户信息'
            modal-append-to-body
            :visible.sync="openDetail"
            width='500px'
        >
            <user-info></user-info>
            <div
                class="btn-group"
                slot='footer'
            >
                <el-button
                    type='primary'
                    :size='$size'
                    @click='openDetail=false'
                >关闭</el-button>
            </div>
        </el-dialog> -->
        <user-info :show.sync='openDetail'></user-info>
        <Pagination></Pagination>
    </div>
</template>
<script>
let tableInfo = [
    { label: "序号", prop: "", width: "120" },
    { label: "用户ID", prop: "id", width: "120" },
    { label: "手机号码", prop: "", width: "120" },
    { label: "用户角色", prop: "", width: "120" },
    { label: "所属区域", prop: "", width: "120" },
    { label: "实名认证", prop: "", width: "120" },
    { label: "用户姓名", prop: "", width: "120" }
];
import UserInfo from "../../../components/user/UserInfoDisplay";
export default {
    components: {
        UserInfo
    },
    data() {
        return {
            tableInfo,
            openDetail: false,
            fake: [
                { id: "122" },
                { id: 123321 },
                { id: "123" },
                { id: 12312312332 }
            ],
            tabName: "all",
            select: "1"
        };
    },
    methods: {
        switchTab(tab) {
            this.tabName = tab;
        },
        openDialog(id) {
            this.openDetail = true;
            console.log(id);
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
