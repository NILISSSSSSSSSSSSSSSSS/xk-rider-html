<template>
    <div class="pagination" v-show='total>0'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="nowPage.currentPage"
            :page-sizes="nowPage.nowSizes" :page-size="nowPage.nowSize" layout="total, sizes, prev, pager, next, jumper"
            :total="pageNum">
        </el-pagination>
    </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
    props: {
        pagesizes: {
            type: Array,
            default: () => [10, 20, 40, 80]
        },
        pagesize: {
            type: Number,
            default: () => 10
        },
        total: {
            type: Number,
            default: () => 0
        },
        form: {
            type: Object
        }
    },
    data() {
        return {
            nowPage: {
                currentPage: 1,
                nowSizes: this.pagesizes,
                nowSize: this.pagesize
            },
            pageNum: this.total,
            nowForm: this.form,
            pageKey: this.$route.path.replace("/", "")
        };
    },
    computed: {
        page() {
            return this.$store.state.pagination[this.pageKey];
        }
    },
    watch: {
        nowPage: {
            handler(newVal, oldVal) {
                this.saveAll();
                this.sendPageInfo();
            },
            deep: true
        },
        total(val) {
            this.pageNum = val;
        },
        form(val) {
            this.nowForm = val;
            this.updatePage(val);
            this.saveAll();
        }
    },
    created() {
        // vuex中是否存在当前页面的状态
        if (this.page) {
            this.getAll();
        } else {
            this.saveAll();
            this.sendPageInfo();
        }
    },
    methods: {
        ...mapMutations({
            savePage: "pagination/savePage"
        }),
        updatePage(val) {
            this.nowPage.nowSize = val.limit;
            this.nowPage.currentPage = val.page;
        },
        // 存入vuex
        saveAll() {
            this.savePage({
                key: this.pageKey,
                page: {
                    nowForm: this.nowForm,
                    pageNum: this.pageNum,
                    ...this.nowPage
                }
            });
        },
        // 从Vuex中获取页面数据
        getAll() {
            let { currentPage, nowSizes, nowSize, nowForm, pageNum } = {
                ...this.page
            };
            this.nowPage = { currentPage, nowSizes, nowSize };
            this.nowForm = nowForm;
            this.pageNum = pageNum;
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.nowPage.nowSize = val;
            this.nowPage.currentPage = 1;
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.nowPage.currentPage = val;
        },
        sendPageInfo() {
            this.$emit("page", {
                page: this.nowPage.currentPage,
                limit: this.nowPage.nowSize,
                form: this.nowForm
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.pagination {
    text-align: center;
    /deep/ .el-input__inner {
        background: transparent;
        border: 0;
        color: #fff;
    }
    /deep/ button {
        background: transparent;
        color: #8c8fee;
        &:disabled {
            color: #ccc;
            opacity: 0.8;
        }
    }
    /deep/ ul {
        background: transparent;
        li {
            background: transparent;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #8c8fee;
            &.active {
                color: #fff;
            }
        }
    }
    /deep/ span {
        color: #fff;
    }
}
</style>
