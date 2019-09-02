<template>
    <div class="rider-container move" v-if='!isAll'>
        <div class="rider-form" style='padding-top:0'>
            <!-- 当模版为全国模版的时候隐藏区域相关功能 -->
            <div class="line-space-between">
                <h1 class="title">使用区域</h1>
                <el-button :size='$size' type='primary' class="rider-btn" @click='openAddArea=true'>添加</el-button>
            </div>
        </div>
        <div class="rider-table">
            <el-table fit :data='tableLimit' :size='$size'>
                <el-table-column label='省' prop='provinceCode' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.provinceCode|getProvinceName}}
                    </template>
                </el-table-column>
                <el-table-column label='市' prop='cityCode' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.cityCode|getCityName}}
                    </template>
                </el-table-column>
                <el-table-column label='区' prop='districtCode' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                <el-table-column label='操作' min-width='120'>
                    <template slot-scope='scope'>
                        <el-button type='danger' :size='$size' @click='removeArea(scope.row)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :total='total' :form='areaPageInfo' @page="getPage"></Pagination>
        <el-dialog :close-on-click-modal="false" :visible.sync="openAddArea" width='400px' title="添加区域" append-to-body>
            <el-form>
                <el-form-item label='配送区域:'>
                    <province-cascader v-model='areaArr'></province-cascader>
                </el-form-item>
            </el-form>
            <div class="footer" slot='footer'>
                <el-button :size='$size' @click='closeAddArea()'>取消</el-button>
                <el-button :size='$size' type='primary' @click='addArea()' :disabled="!areaArr.length">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import ProvinceCascader from "./../ProvinceCascader";
export default {
    components: {
        ProvinceCascader
    },
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            areaPageInfo: { page: 1, limit: 10 },
            total: 0,
            areaArr: [],
            // areaTableData: this.data,
            openAddArea: false,
            loading: false
        };
    },
    watch: {
        // 监听地址数量,自动滚动到底
        total(newV, oldV) {
            if (!oldV) return;
            let bottom = document.querySelector(".btn-group");
            bottom.scrollIntoView({ block: "end", behavior: "smooth" });
        }
    },
    computed: {
        areaTableData: {
            get() {
                this.total = this.data.length;
                return JSON.parse(JSON.stringify(this.data));
            },
            set(newV) {}
        },
        tableLimit() {
            let table = JSON.parse(JSON.stringify(this.areaTableData));
            let page = this.areaPageInfo.page;
            let limit = this.areaPageInfo.limit;
            let tablePage = table.splice((page - 1) * limit, limit);
            return tablePage;
        },
        areaToObj() {
            let [provinceCode, cityCode, districtCode] = this.areaArr;
            return {
                provinceCode,
                cityCode,
                districtCode
            };
        },
        isAll() {
            return this.$route.query.whole - 0;
        }
    },
    methods: {
        closeAddArea() {
            this.areaArr = [];
            this.openAddArea = false;
        },
        // 添加适用区域
        addArea() {
            var all = JSON.stringify(this.areaTableData);
            // var one = JSON.stringify(this.areaToObj.districtCode);
            var one = this.areaToObj.districtCode + "";
            // var index = all.indexOf(one);
            // if (index !== -1) {
            if (all.includes(one)) {
                this.$message.warning("请不要重复添加");
                return;
            }
            this.areaTableData.unshift(this.areaToObj);
            this.total = this.areaTableData.length;
            this.areaArr = [];
            this.openAddArea = false;
            this.$emit("update:data", this.areaTableData);
        },
        // 本地分页删除区域
        removeArea(item) {
            this.$confirm("确定删除该区域?", "提示", {
                cancelButtonText: "取消",
                confirmButtonText: "删除",
                type: "warning"
            })
                .then(res => {
                    var all = JSON.stringify(this.areaTableData);
                    var deleteOne = JSON.stringify(item);
                    var index = all.indexOf(deleteOne);
                    console.log("TCL: removeArea -> index", index);
                    if (index !== -1) {
                        let replaceAll = all.replace(deleteOne, "{}");
                        let parseAll = JSON.parse(replaceAll);
                        for (let i = 0, l = parseAll.length; i < l; i++) {
                            if (JSON.stringify(parseAll[i]) == "{}") {
                                parseAll.splice(i, 1);
                            }
                        }
                        this.areaTableData = parseAll;
                        this.$emit("update:data", parseAll);
                        this.total = parseAll.length;
                        if (this.total % 10 === 0) {
                            this.areaPageInfo.page--;
                        }
                    }
                })
                .catch(err => {
                    this.$message.info("已取消删除");
                });
        },
        // 本地分页
        getPage(val) {
            this.areaPageInfo = { limit: val.limit, page: val.page };
            if (this.areaTableData.length < val.limit * (val.page - 1)) {
                this.areaPageInfo = {
                    limit: 10,
                    page: 1
                };
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.move {
    transform: translateY(-25px);
    width: 1180px;
}
.rider-table {
    padding: 0 100px;
    margin-bottom: 30px;
    .rider-table-btn-group {
        text-align: right;
    }
}
</style>


