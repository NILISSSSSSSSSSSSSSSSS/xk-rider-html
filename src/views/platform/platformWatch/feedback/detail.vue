
<template>
    <div class="feedback-detail">
        <div class="line">
            <div class="user-info">
                <span>用户名称：</span>
                <span>张三</span>
            </div>
            <div class="user-info">
                <span>用户ID：</span>
                <span>张三</span>
            </div>
            <div class="user-info">
                <span>手机号码：</span>
                <span>136555505055</span>
            </div>
        </div>
        <div class="line line-2">
            <div>反馈内容：</div>
            <div>反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容反馈内容</div>
        </div>
        <div class="line line-3">
            <div>反馈时间：</div>
            <div>2018-09-09 12:12:12</div>
        </div>
        <div class="btn-group">
            <el-button :size='$size' @click='back'>返回</el-button>
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        back() {
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="scss" scoped>
.feedback-detail {
    .line {
        display: flex;
        justify-content: flex-start;

        .user-info {
            span {
                display: inline-block;

                &:first-child {
                    width: 100px;
                }

                &:last-child {
                    width: 200px;
                }
            }
        }
    }

    .line-2 {
        align-items: flex-start;

        div:first-child {
            width: 100px;
        }

        div:last-child {
            width: 500px;
        }
    }

    .line-3 {
        align-items: center;

        div:first-child {
            width: 100px;
        }

        div:last-child {
            width: 500px;
        }
    }
}
</style>