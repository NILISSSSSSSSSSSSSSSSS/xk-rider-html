<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="open" width='500px' :title='`${Object.keys(item).length==0?"新增":"修改"}${device}客户端版本`'>
        <el-form label-width='120px'>
            <el-form-item label='客户端版本号：'>
                <div class="line-start-start">
                    <!-- <positive-input v-model='v1' @input='checkLength("v1",$event)'></positive-input>. -->
                    <el-input v-model='v1' ref='v1' type='number' @input='checkLength("v1",$event)' :size='$size'></el-input>&nbsp;.&nbsp;
                    <el-input v-model='v2' ref='v2' type='number' @input='checkLength("v2",$event)' :size='$size'></el-input>&nbsp;.&nbsp;
                    <el-input v-model='v3' ref='v3' type='number' @input='checkLength("v3",$event)' :size='$size'></el-input>
                </div>
            </el-form-item>
            <el-form-item label='版本名称：'>
                <el-input v-model='formData.name' :size='$size'></el-input>
            </el-form-item>
            <el-form-item label='升级说明：'>
                <el-input v-model='formData.updateMessage' type='textarea' :size='$size' :autosize="{minRows:3}"></el-input>
            </el-form-item>
        </el-form>
        <div slot='footer'>
            <el-button :size='$size' @click='open=false'>取消</el-button>
            <el-button :size='$size' type='primary' @click='add'>确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
// import PositiveInput from "./../all/PositiveNumInput";
export default {
    // components: {
    //     PositiveInput
    // },
    props: {
        device: {
            type: String,
            default: ""
        },
        item: {
            type: Object,
            default: () => {}
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            this.$emit("update:show", val);
            if (!val) {
                this.formData = {};
            }
        },
        item(val) {
            let obj = JSON.parse(JSON.stringify(val));
            this.formData = obj;
            let newV = obj.newVersion;
            this.changeVersion(newV);
        }
    },
    computed: {
        newV() {
            return `${this.v1}.${this.v2}.${this.v3}`;
        }
    },
    data() {
        return {
            open: this.show,
            v1: "",
            v2: "",
            v3: "",
            formData: JSON.parse(JSON.stringify(this.item))
        };
    },
    methods: {
        changeVersion(version) {
            let arr = (version + "").split("");
            let l = arr.length;
            if (l == 5) {
                this.v1 = arr[0] - 0;
                this.v2 = `${arr[1]}${arr[2]}` - 0;
                this.v3 = `${arr[3]}${arr[4]}` - 0;
            }
            if (l == 6) {
                this.v1 = `${arr[0]}${arr[1]}` - 0;
                this.v2 = `${arr[2]}${arr[3]}` - 0;
                this.v3 = `${arr[4]}${arr[5]}` - 0;
            }
        },
        checkLength(position, e) {
            let last = position.charAt(position.length - 1);
            let next = `v${last - 0 + 1}`;
            if (e < 0) {
                this[position] = 0 - e;
            }
            if (e.length == 2) {
                if (last - 0 < 3) {
                    this.$refs[next].focus();
                }
            }
            if (e > 99) {
                let str = e
                    .split("")
                    .splice(0, 2)
                    .join("");
                this.$nextTick(() => {
                    this[position] = str;
                });
            }
            if (parseInt(e - 0) != e) {
                this.$nextTick(() => {
                    this[position] = parseInt(e - 0);
                });
            }
        },
        add() {
            this.formData.deviceOs = this.device.toLowerCase();
            this.formData.newVersion = this.newV;
            if (
                !this.formData.name ||
                !(this.v1 + "") ||
                !(this.v2 + "") ||
                !(this.v3 + "") ||
                !this.formData.updateMessage
            ) {
                this.$message({ message: "请补全或修正信息", type: "error" });
                return;
            }
            let api = this.$api.platformVersionAdd;
            let successMessage = "新增成功";
            let errorMessage = "新增失败";
            if (Object.keys(this.item).length > 0) {
                api = this.$api.platformVersionUpdate;
                successMessage = "修改成功";
                errorMessage = "修改失败";
            }
            this.$http
                .post(api, this.formData, true)
                .then(res => {
                    this.$notify({
                        title: "成功",
                        message: successMessage,
                        type: "success"
                    });
                    this.$emit("success");
                    this.open = false;
                })
                .catch(err => {
                    this.$notify({
                        title: "失败",
                        message:
                            errorMessage + "," + err.code + "," + err.message,
                        type: "warning"
                    });
                });
        }
    }
};
</script>

