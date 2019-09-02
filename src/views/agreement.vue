<template>
    <div class="show-agreement" v-html='content'></div>
</template>

<script>
// import "quill/dist/quill.core.css";
export default {
    data() {
        return {
            content: ""
        };
    },
    created() {
        this.getDetail();
    },
    methods: {
        getDetail() {
            let data = {
                number: this.$route.query.id
            };
            this.$http
                .get(this.$api.agreementDetail, data, true)
                .then(res => {
                    this.content = res.content;
                })
                .catch(err => {
                    this.$message.error("获取协议失败,请稍候重试");
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.show-agreement {
    width: 100vw;
    min-height: 100vh;
    background: #fff;
    word-wrap: break-word;
}
</style>

