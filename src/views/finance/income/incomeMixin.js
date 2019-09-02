export default {
    data() {
        return {
            openTransaction: false,
            transactionDetail: null,
            transactionLock: false
        };
    },
    methods: {
        toDetail(orderNo) {
            this.$router.push({ name: "orderDetail", query: { id: orderNo } });
        },
        toTransaction(dispatchOrderNo) {
            this.transactionLock = true;
            this.$http
                .get(this.$api.financeTradeDetail, { dispatchOrderNo }, true)
                .then(res => {
                    this.transactionDetail = res;
                    if (this.transactionDetail.dispatchOrderNo) {
                        this.openTransaction = true;
                    }
                    this.transactionLock = false;
                })
                .catch(err => {
                    this.$message.error("获取详情失败 错误码:" + err.code);
                    this.transactionLock = false;
                });
        }
    }
};
