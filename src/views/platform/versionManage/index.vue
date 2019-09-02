<template>
    <div class="rider-container version-manage">
        <div class="rider-switch">
            <div class="tab" :class="{active:formData.deviceOs=='ios'}" @click='switchTab()'>iOS</div>
            <div class="tab" :class="{active:formData.deviceOs=='android'}" @click='switchTab()'>Android</div>
            <div class="close-form-btn">
                <el-button type='primary' :size='$size' @click='openAdd' v-if='versionCreate'>新增</el-button>
            </div>
        </div>
        <div class="rider-table">
            <el-table :size='$size' fit v-loading='loading' :data='tableData' element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column label='操作系统' prop='deviceOs' width="120"></el-table-column>
                <el-table-column label='客户端版本号' prop='newVersion' min-width="120">
                    <template slot-scope="scope">
                        {{scope.row.newVersion|formatVersion}}
                    </template>
                </el-table-column>
                <el-table-column label='版本名称' prop='name' min-width="120"></el-table-column>
                <el-table-column label='升级说明' prop='updateMessage' min-width="200">
                    <template slot-scope='scope'>
                        <pre>{{scope.row.updateMessage}}</pre>
                    </template>
                </el-table-column>
                <el-table-column label='操作' min-width="150">
                    <template slot-scope='scope'>
                        <el-button :size='$size' @click='toSubVersion(scope.row)'>查看子版本</el-button>
                        <el-button :size='$size' type='primary' :loading="btnLoading" @click='updateOne(scope.row)'>编辑</el-button>
                        <el-button :size='$size' type='danger' :loading="btnLoading" @click='deleteOne(scope.row.id)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <add-version :show.sync='showAdd' :device='formData.deviceOs' :item='updateItem' @success='getList'></add-version>
        <pagination :form='formData' :total='total' @page='getPage'></pagination>
    </div>
</template>
<script>
import { canUse, versionCreate } from "./../../../menu/permission.js";
import AddVersion from "./../../../components/platform/AddVersion";
export default {
    components: {
        AddVersion
    },
    data() {
        return {
            versionCreate,
            loading: false,
            showAdd: false,
            formData: { deviceOs: "ios", page: 1, limit: 10 },
            total: 0,
            tableData: [],
            updateItem: {},
            btnLoading: false
        };
    },
    methods: {
        switchTab() {
            if (this.formData.deviceOs == "ios") {
                this.formData.deviceOs = "android";
                this.getList();
                return;
            }
            if (this.formData.deviceOs == "android") {
                this.formData.deviceOs = "ios";
                this.getList();
                return;
            }
        },
        openAdd() {
            this.showAdd = true;
            this.updateItem = {};
        },
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.platformVersionList, this.formData, true)
                .then(res => {
                    console.log("TCL: getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    console.log("TCL: getList -> err", err);
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    this.loading = false;
                });
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        updateOne(item) {
            if (!canUse("versionUpdate")) return;
            if (!item) return;
            let { updateMessage, newVersion, name, deviceOs, id } = item;
            this.updateItem = {
                updateMessage,
                newVersion,
                name,
                deviceOs,
                id
            };
            this.showAdd = true;
        },
        toSubVersion(item) {
            if (!canUse("subversionList")) return;
            this.$router.push({
                name: "subVersion",
                query: {
                    defId: item.id,
                    version: item.newVersion,
                    os: item.deviceOs
                }
            });
        },
        deleteOne(vid) {
            if (!canUse("versionDelete")) return;
            this.btnLoading = true;
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$http
                        .post(
                            this.$api.platformVersionDelete,
                            { id: vid },
                            true
                        )
                        .then(res => {
                            this.btnLoading = false;
                            this.$message.success("删除成功!");
                            this.getList();
                        })
                        .catch(err => {
                            this.$message.warning("删除失败!");
                            this.btnLoading = false;
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped src='./index.scss'></style>

