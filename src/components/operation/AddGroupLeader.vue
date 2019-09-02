<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="open" width='500px' append-to-body>
        <el-form :model="formData" label-width="100px" label-position='center'>
            <el-form-item label="账号状态:">
                <el-radio v-model="formData.isFrozen" label="0">激活</el-radio>
                <el-radio v-model="formData.isFrozen" label="1">冻结</el-radio>
            </el-form-item>
            <el-form-item label="真实姓名:">
                <el-input :size='$size' placeholder="请输入您的真实姓名" maxlength="6" v-model='formData.realName'></el-input>
            </el-form-item>
            <el-form-item label="用户账号:">
                <el-input :size='$size' placeholder="请输入您的手机号" v-model='formData.phone'></el-input>
            </el-form-item>
            <el-form-item label="用户密码:">
                <el-input :size='$size' placeholder="请输入您的密码" type='password' autocomplete="new-password" v-model='formData.password'></el-input>
            </el-form-item>
            <el-form-item label="所属区域:">
                <province-cascader v-model='area'></province-cascader>
            </el-form-item>
        </el-form>
        <div slot='footer'>
            <el-button :size='$size' @click='cancel()' :loading="loading">取消</el-button>
            <el-button :size='$size' type='primary' @click='add' :loading="loading">保存</el-button>
        </div>
    </el-dialog>
</template>
<script>
import ProvinceCascader from "./../ProvinceCascader";
export default {
    components: {
        ProvinceCascader
    },
    props: {
        show: {
            type: Boolean
        }
    },
    data() {
        return {
            open: this.show,
            formData: {
                isFrozen: "0",
                realName: "",
                phone: "",
                password: ""
            },
            area: [],
            loading: false
        };
    },
    computed: {
        mFormData() {
            let area = this.area;
            let data = {
                provinceCode: area[0],
                cityCode: area[1],
                districtCode: area[2]
            };
            return { ...this.formData, ...data };
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
        add() {
            for (let key in this.mFormData) {
                if (this.mFormData.hasOwnProperty(key)) {
                    if (!this.mFormData[key]) {
                        switch (key) {
                            case "realName":
                                this.$message.warning("请输入您的真实姓名");
                                break;
                            case "phone":
                                this.$message.warning("请输入您的手机号(账号)");
                                break;
                            case "password":
                                this.$message.warning("请输入您的密码");
                                break;
                            case "provinceCode":
                                this.$message.warning("请选择省");
                                break;
                            case "cityCode":
                                this.$message.warning("请选择市");
                                break;
                            case "districtCode":
                                this.$message.warning("请选择区");
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            this.loading = true;
            this.$http
                .post(this.$api.operationAddGroupLeader, this.mFormData, true)
                .then(res => {
                    this.open = false;
                    this.loading = false;
                    console.log("​add -> res", res);
                    this.$notify.success({
                        title: "提示",
                        message: `添加成功`
                    });
                    this.formData = { isFrozen: "0" };
                    this.area = [];
                    this.$emit("success");
                })
                .catch(err => {
                    console.log("​add -> err", err, this.open);
                    this.loading = false;
                    this.$notify.warning({
                        title: "提示",
                        message: `添加失败 ${err.message}`
                    });
                });
        },
        cancel() {
            this.formData = { isFrozen: "0" };
            this.area = [];
            this.open = false;
        }
    }
};
</script>
