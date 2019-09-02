<template>
    <el-input type="number" :class="{'error':!isNum}" v-model.number='num' :placeholder="placeholder" :size='$size'
        @focus='focusInput' @blur='blurInput' @input='checkAndSend'>
        <i class="suffix" slot="suffix" v-if='suffix'>{{suffix}}</i>
        <i class="prefix" slot="prefix" v-if='prefix'>{{prefix}}</i>
    </el-input>
</template>
<script>
export default {
    props: {
        value: {
            type: [String, Number],
            default: ""
        },
        placeholder: {
            type: [String, Number],
            default: ""
        },
        max: {
            type: [String, Number],
            default: -1
        },
        suffix: {
            type: String,
            default: ""
        },
        prefix: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            num: this.value,
            isNum: true
        };
    },
    watch: {
        value(val) {
            this.num = val;
        }
        // num(val) {
        //     let sendNum = "";
        //     if (val < 0) {
        //         sendNum = 0 - val + "";
        //         this.$nextTick(() => {
        //             this.num = 0 - val;
        //         });
        //         this.isNum = true;
        //     } else if (this.$el.firstElementChild.validity.badInput) {
        //         this.isNum = false;
        //     } else if (val == "") {
        //         sendNum = val;
        //         this.isNum = true;
        //     } else if (val - 0 >= 0) {
        //         sendNum = val - 0 + "";
        //         this.isNum = true;
        //         this.$nextTick(() => {
        //             this.num = Number(val);
        //         });
        //     }
        //     this.$emit("input", sendNum);
        // }
    },
    methods: {
        checkAndSend(val) {
            let sendNum = "";
            if (val < 0) {
                sendNum = 0 - val + "";
                this.$nextTick(() => {
                    this.num = 0 - val;
                });
                this.isNum = true;
            } else if (this.$el.firstElementChild.validity.badInput) {
                this.isNum = false;
            } else if (val == "") {
                sendNum = val;
                this.isNum = true;
            } else if (val - 0 >= 0) {
                if (this.max > 0 && this.max < val - 0) {
                    this.isNum = false;
                } else {
                    sendNum = val - 0 + "";
                    this.isNum = true;
                    this.$nextTick(() => {
                        this.num = Number(val);
                    });
                }
            }
            this.$emit("input", sendNum);
        },
        focusInput(e) {
            let input = e.target;
            input.addEventListener("mousewheel", this.wheel, false);
            input.addEventListener("DOMMouseScroll", this.wheel, false);
        },
        blurInput(e) {
            let input = e.target;
            input.removeEventListener("mousewheel", this.wheel, false);
            input.removeEventListener("DOMMouseScroll", this.wheel, false);
        },
        // 禁用滚动加减
        wheel(e) {
            // event = e || window.event;
            e.preventDefault();
        }
    }
};
</script>
<style lang="scss" scoped>
.error {
    /deep/ .el-input__inner {
        background: rgba(245, 108, 108, 0.5) !important;
    }
}
.suffix,
.prefix {
    color: #fff;
    opacity: 0.8;
}
.suffix {
    top: 50%;
    transform: translateY(-50%);
}
.prefix {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}
</style>




