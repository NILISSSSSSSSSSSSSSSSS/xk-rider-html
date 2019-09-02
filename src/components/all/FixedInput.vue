<template>
    <positive-input v-model="inputValue" :placeholder='$attrs.placeholder||""'></positive-input>
</template>

<script>
import PositiveInput from "./PositiveNumInput";
export default {
    components: {
        PositiveInput
    },
    props: {
        value: {
            type: [Number, String],
            default: ""
        },
        fixed: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            inputValue: this.value
        };
    },
    watch: {
        // value(val) {
        //     this.inputValue = val;
        // }
        inputValue(val) {
            let value = "";
            if (val) {
                value = this.fix(val);
                this.$nextTick(() => {
                    this.inputValue = value;
                });
            }
            this.$emit("input", value);
        }
    },
    methods: {
        fix(e) {
            let value = e;
            let newValue = "";
            if (value && value >= 0) {
                if (this.fixed < 0) {
                    // this.$emit("input", value);
                    return value;
                }
                //用fixed四舍五入快速输入的时候会越来越大,所以下取整
                newValue =
                    Math.floor(value * 10 ** this.fixed) / 10 ** this.fixed;
                // this.$nextTick(() => {
                //     this.inputValue = newValue;
                // });
            }
            return newValue;
        }
    }
};
</script>