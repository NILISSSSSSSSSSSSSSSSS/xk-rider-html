export default {
    data() {
        return {
            // open: this.show,
            btnLoading: false
        }
    },
    // props: {
    //     show: {
    //         type: Boolean
    //     }
    // },
    // watch: {
    //     show(val) {
    //         this.open = val;
    //     },
    //     open(val) {
    //         this.$emit("update:show", val);
    //     }
    // },
    methods: {

        /**
         *审核
         *
         * @param {*} ids
         * @param {*} authMessage
         * @param {*} drawStatus
         * @param {*} [success=function () {}]
         */
        checkItems({
            ids,
            authMessage,
            drawStatus
        }, success = function () {}) {
            this.btnLoading = true;
            let data = {
                ids,
                authMessage,
                drawStatus
            }
            this.$http
                .post(this.$api.financeCheck, data, true)
                .then(res => {
                    this.$notify.success({
                        title: "成功",
                        message: "审核成功"
                    });
                    setTimeout(() => {
                        success()
                        this.btnLoading = false;
                    }, 1000)
                })
                .catch(err => {
                    console.log('TCL: checkItems -> err', err);
                    this.$notify.warning({
                        title: "失败",
                        message: "审核失败 错误码:" + err.code
                    });
                    setTimeout(() => {
                        this.btnLoading = false;
                    }, 1000)
                });
        },
        /**
         *确认
         *
         * @param {*} id
         * @param {*} authMessage
         * @param {*} drawStatus
         * @param {*} [success=function () {}]
         */
        confirmItems({
            id,
            authMessage,
            drawStatus
        }, success = function () {}) {
            this.btnLoading = true;
            let data = {
                id,
                authMessage,
                drawStatus
            };
            this.$http
                .post(this.$api.financeCheckConfirm, data, true)
                .then(res => {
                    this.$notify.success({
                        title: "成功",
                        message: "审核成功"
                    });
                    setTimeout(() => {
                        success()
                        this.btnLoading = false;
                    }, 1000)
                })
                .catch(err => {
                    console.log('TCL: confirmItems -> err', err);
                    this.$notify.warning({
                        title: "失败",
                        message: "审核失败 错误码:" + err.code
                    });
                    setTimeout(() => {
                        this.btnLoading = false;
                    }, 1000)
                });
        },
    }
}