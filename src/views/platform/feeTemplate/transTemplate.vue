<template>
    <div class="trans-template rider-container">
        <div class="rider-switch">
            <div class="tab active">运费模版列表</div>
            <div class="close-form-btn">
                <el-button :size='$size' type='primary' @click="$router.push({name:'newTemplate'})" v-if='templateNew'>新建运费模版</el-button>
            </div>
        </div>
        <!-- <div class="rider-search">
            <el-form label-width="100px" :inline="true">
                <el-form-item label='配送区域'>
                    <province-cascader class='rider-input margin-right-20' v-model='areaValue'></province-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button class="rider-btn submit">搜索</el-button>
                </el-form-item>
            </el-form>
        </div> -->
        <div class="rider-table">
            <!-- <div class="rider-table-btn-group">
                <el-button class="rider-btn" type='danger'>批量删除</el-button>
                <span>已选中<span class="text-blue">{{chooseList.length}}</span>条运费模板</span>
            </div> -->
            <el-table :size='$size' fit :data='tableData' v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'>
                <!-- @selection-change="handleSelectionChange"> -->
                <!-- <el-table-column type='selection' width='83'></el-table-column> -->
                <el-table-column type='index' width='83' label='序号' :index='function(index){return (index+1)+(formData.page-1)*formData.limit}'></el-table-column>
                <el-table-column label='模版名称' prop='name' min-width='120'></el-table-column>
                <el-table-column label='区域' min-width='120'>
                    <template slot-scope='scope'>
                        <el-popover placement="left" width="400" trigger="click" v-if='!scope.row.isAll'>
                            <el-table :data="scope.row.regions" style='margin-top:0' :height='(scope.row.regions.length*40>500?500:scope.row.regions*40)+"px"'
                                :size='$size'>
                                <el-table-column width="120" label="省">
                                    <template slot-scope='re'>
                                        {{re.row.provinceCode|getProvinceName}}
                                    </template>
                                </el-table-column>
                                <el-table-column width="120" label="市">
                                    <template slot-scope='re'>
                                        {{re.row.cityCode|getCityName}}
                                    </template>
                                </el-table-column>
                                <el-table-column width="120" label="区">
                                    <template slot-scope='re'>
                                        {{re.row.districtCode|getDistrictName}}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button :size="$size" type='primary' slot="reference">查看</el-button>
                        </el-popover>
                        <div v-else>全国</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label='商品类别' prop='id' min-width='120'></el-table-column> -->
                <!-- <el-table-column label='计费规则' prop='id' min-width='120'></el-table-column> -->
                <el-table-column label='操作' min-width='120'>
                    <template slot-scope='scope'>
                        <el-button :size='$size' type='primary' @click='toModify(scope.row)'>配置</el-button>
                        <el-button :size='$size' type='danger' @click="deleteOne(scope.row.id)" v-if='!scope.row.isAll'
                            :disabled="!(tableData.length>1)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :form='formData' :total='total' @page='getPage'></Pagination>
    </div>
</template>
<script>
// import ProvinceCascader from "../../../components/ProvinceCascader";
import { templateNew, canUse } from "./../../../menu/permission.js";
export default {
    // components: {
    //     ProvinceCascader
    // },
    data() {
        return {
            templateNew,
            areaValue: [],
            formData: {
                limit: 10,
                page: 1
            },
            total: 0,
            tableData: [],
            loading: false
            // chooseList: []
        };
    },
    methods: {
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.platformTemplateList, this.formData, true)
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
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        toModify(val) {
            if (!canUse("templateUpdate")) return;
            this.$router.push({
                name: "newTemplate",
                query: { id: val.id, modify: true, whole: val.isAll } //模版id,是否修改,是否全国
            });
        },
        // handleSelectionChange(val) {
        //     console.log(val);
        //     let arr = [];
        //     let l = val.length;
        //     for (let i = 0; i < l; i++) {
        //         let id = val[i].id;
        //         arr.push(id);
        //     }
        //     this.chooseList = arr;
        // },
        deleteOne(id) {
            if (!id) {
                this.$message.error("无有效模版ID");
                return;
            }
            this.deleteItems(id);
        },
        deleteItems(id) {
            if (!canUse("templateDelete")) return;
            this.$confirm("此操作将永久删除模板, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let data = { tempId: id };
                    this.$http
                        .post(this.$api.platformTemplateDelete, data, true)
                        .then(res => {
                            this.$notify({
                                title: "提示",
                                message: "删除成功",
                                type: "success"
                            });
                            this.getList();
                        })
                        .catch(err => {
                            this.$notify({
                                title: "提示",
                                message: `删除失败${
                                    err.message ? "," + err.message : ""
                                }`,
                                type: "warning"
                            });
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



