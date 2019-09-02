<template>
    <div class="rider-container sub-version">
        <div class="rider-switch">
            <div class="tab active">版本{{$route.query.version|formatVersion}}</div>
            <div class="close-form-btn">
                <span class='text-blue point-style margin-right-20' @click='$router.go(-1)'>返回上一级</span>
                <el-button :size='$size' type='primary' @click='openAdd' v-if='subversionCreate'>新增</el-button>
            </div>
        </div>
        <div class="rider-search">
            <el-form label-width='100px'>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='更新方式:'>
                            <el-select class="rider-input" :size='$size' v-model='formData.updateType' @change="getList">
                                <el-option v-for='item in updateTypes' :key='item.value' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="rider-table">
            <el-table fit v-loading="loading" element-loading-background='rgba(0,0,0,0.8)' :data='tableData'>
                <el-table-column label='操作系统' type='index' :index='function(index){return $route.query.os}' prop=""
                    width='120'></el-table-column>
                <!-- <el-table-column label='操作系统' min-width='120'>
                    <template slot-scope="scope">
                        {{$route.query.os}}
                    </template>
                </el-table-column> -->
                <el-table-column label='客户端版本号' prop='defVersion' min-width='120'>
                    <template slot-scope="scope">
                        {{scope.row.defVersion|formatVersion}}
                    </template>
                </el-table-column>
                <el-table-column label='最大版本号' prop='maxVersion' min-width='120'>
                    <template slot-scope="scope">
                        {{scope.row.maxVersion|formatVersion}}
                    </template>
                </el-table-column>
                <el-table-column label='最小版本号' prop='minVersion' min-width='120'>
                    <template slot-scope="scope">
                        {{scope.row.minVersion|formatVersion}}
                    </template>
                </el-table-column>
                <el-table-column label='安装包大小(MB)' prop='appSize' min-width='120'></el-table-column>
                <el-table-column label='更新方式' prop='' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.updateType|upType}}
                    </template>
                </el-table-column>
                <el-table-column label='强制更新' prop='' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.isForce==1?"是":"否"}}
                    </template>
                </el-table-column>
                <el-table-column label='更新说明' prop='updateMessage' min-width='300'>
                    <template slot-scope='scope'>
                        <pre>{{scope.row.updateMessage}}</pre>
                    </template>
                </el-table-column>
                <el-table-column label='操作' prop='' min-width='120'>
                    <template slot-scope='scope'>
                        <el-button :size='$size' type='primary' @click='updateOne(scope.row)'>编辑</el-button>
                        <el-button :size='$size' type='danger' @click='deleteOne(scope.row.id)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <add-sub :show.sync='showAdd' :version="sendVersion" :item='updateItem' :versionList='tableData' :updateType='updateTypes'
            @success='getList'></add-sub>
        <Pagination :form='formData' :total='total' @page='getPage'></Pagination>
    </div>
</template>
<script>
import AddSub from "./../../../components/platform/AddSubVersion";
import { canUse, subversionCreate } from "./../../../menu/permission.js";
import { updateTypes } from "./../../../util/publicParams.js";

export default {
    components: {
        AddSub
    },
    data() {
        return {
            subversionCreate,
            updateTypes,
            formData: {
                updateType: "",
                limit: 10,
                page: 1
            },
            showAdd: false,
            total: 0,
            loading: false,
            tableData: [],
            updateItem: {}
        };
    },
    computed: {
        sendVersion() {
            return {
                id: this.formData.defId,
                version: this.$route.query.version
            };
        }
    },
    filters: {
        upType(val) {
            for (let i of updateTypes) {
                if (i.value == val) {
                    return i.label;
                }
            }
        }
    },
    methods: {
        getPage(val) {
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        getList() {
            this.loading = true;
            this.formData.defId = this.$route.query.defId;
            this.$http
                .get(this.$api.platformSubVersionList, this.formData, true)
                .then(res => {
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                    this.$message.error("获取列表失败 错误码" + err.code);
                });
        },
        openAdd() {
            this.showAdd = true;
            this.updateItem = {};
        },
        updateOne(item) {
            if (!canUse("subversionUpdate")) return;
            let {
                updateType,
                updateMessage,
                defVersion,
                defId,
                maxVersion,
                minVersion,
                id,
                isForce,
                appSize,
                url
            } = item;
            this.updateItem = {
                updateType,
                updateMessage,
                defVersion,
                defId,
                maxVersion,
                minVersion,
                id,
                isForce,
                appSize,
                url
            };
            this.showAdd = true;
        },
        deleteOne(vid) {
            if (!canUse("subversionDelete")) return;
            this.btnLoading = true;
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$http
                        .post(
                            this.$api.platformSubVersionDelete,
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

