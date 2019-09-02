<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="open" title='新增角色' width='500px' v-if='open'>
        <el-form label-width="130px" label-position="left">
            <el-form-item label='请输入角色名称：'>
                <el-input :size="$size" placeholder="请输入角色名称" v-model='formData.name'></el-input>
            </el-form-item>
            <el-form-item label='复用权限:'>
                <el-select :size='$size' v-model='formData.roleId'>
                    <el-option label='不复用' value=''></el-option>
                    <el-option v-for='(item,index) in roles' :key='index' :label='item.name' :value='item.id'></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="footer" slot='footer'>
            <el-button :size="$size" @click='open=false'>取消</el-button>
            <el-button :size="$size" type='primary' @click='addRole()'>确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        roles: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            open: this.show,
            // options: [{ label: "不复用", value: "" }],
            formData: {},
            services: "",
            name: "",
            api: this.$api.permissionCreateRole
        };
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            if (!val) {
                this.$emit("update:show", val);
            }
        }
    },
    methods: {
        addRole() {
            let rid = this.formData.roleId;
            let roles = this.roles;
            if (!this.formData.name) {
                this.$message.warning("请输入角色名称");
                return;
            }
            if (!rid && rid != "") {
                this.$message.warning("请选择是否复用");
                return;
            }
            for (let item of roles) {
                if (item.id == rid) {
                    if (item.roleType == "SYSTEM") {
                        this.$message.warning("不能复用区域管理员");
                        return;
                    }
                }
            }
            this.$http
                .post(this.api, this.formData, true)
                .then(res => {
                    this.$notify({
                        title: "提示",
                        message: "添加成功",
                        type: "success"
                    });
                    this.$emit("success");
                    this.open = false;
                })
                .catch(err => {
                    this.$notify({
                        title: "提示",
                        message: "添加失败",
                        type: "error"
                    });
                });
        }
    }
};
</script>
