
<template>
    <div>
        <!-- checked 审核成功 -->
        <div class="checked">
            <div class="item">
                <label>提现状态:</label>
                <span>{{item.drawStatus=='confirm'?"提现成功":"提现失败"}}</span>
            </div>
            <div class="item">
                <label>处理时间:</label>
                <span>{{item.updatedAt|formatTime}}</span>
            </div>
            <div class="item" v-if='item.authMessage'>
                <label>原因:</label>
                <span>{{item.authMessage}}</span>
            </div>
        </div>
        <div class="btn-group">
            <el-button type='' :size='$size' @click='open=false'>返回</el-button>
        </div>
    </div>

</template>
<script>
import dialogMixin from "./dialogMixin.js";
export default {
    mixins: [dialogMixin],
    props: {
        item: {
            type: Object
        }
    },
    data() {
        return {};
    }
};
</script>
<style lang="scss" scoped src='./check.scss'></style>