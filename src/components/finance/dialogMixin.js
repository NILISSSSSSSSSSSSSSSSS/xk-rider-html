export default {
    props: {
        show: {
            type: Boolean
        }
    },
    data() {
        return {
            open: this.show,
        }
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            this.$emit("update:show", val);
        }
    },
    methods: {
        findType(status) {
            let types = this.$attrs.checkType;
            for (let i in types) {
                if (types[i].value == status) {
                    return types[i].label;
                }
            }
            return "暂无";
        }
    }
}