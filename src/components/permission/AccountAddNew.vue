<template>
    <el-dialog :close-on-click-modal="false" width='500px' :visible.sync="open" append-to-body :title='Object.keys(item).length?"修改账号":"新增账号"'>
        <el-form label-width="100px" v-if='open'>
            <el-form-item label='真实姓名:'>
                <el-input :size='$size' placeholder="请输入您的真实姓名" type="text" autocomplete="off" v-model='formData.realName'></el-input>
            </el-form-item>
            <el-form-item label='用户账号:'>
                <el-input :size='$size' placeholder="请输入账号" type='number' @input="checkPhone" v-model='formData.phone'></el-input>
            </el-form-item>
            <el-form-item label='用户密码:'>
                <el-input :size='$size' placeholder="请输入密码" type='text' autocomplete="new-password" @focus="text2password"
                    v-model='formData.password'></el-input>
            </el-form-item>
            <el-form-item label='用户角色:'>
                <el-select :size="$size" v-model='roleValue' style='width:250px;'>
                    <el-option v-for='(item,index) in roleList' :key='index' :label='item.name' :value='item.id'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='所属区域:'>
                <province-cascader v-model='area' style='width:250px;'></province-cascader>
            </el-form-item>
        </el-form>
        <div class="footer" slot='footer'>
            <el-button :size="$size" type="default" :loading="loading" @click='open=false'>取消</el-button>
            <el-button :size="$size" type="primary" :loading="loading" @click='add'>确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import ProvinceCascader from "./../ProvinceCascader";
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default: {}
        }
    },
    components: {
        ProvinceCascader
    },
    data() {
        return {
            open: this.show,
            formData: {},
            roleValue: "",
            area: [],
            roleList: [],
            api: null,
            loading: false
        };
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            if (val) {
                this.formData = {};
                this.roleValue = "";
                this.getRoleList();
            }
            this.$emit("update:show", val);
        },
        item(val) {
            this.getDetail();
            // if (val) {
            //     this.api = this.$api.permissionAccountModify;
            // } else {
            //     this.api = this.$api.permissionAccountCreate;
            // }
        }
    },
    computed: {
        mArea() {
            let [
                provinceCode = null,
                cityCode = null,
                districtCode = null
            ] = this.area;
            return { provinceCode, cityCode, districtCode };
        },
        roleIds() {
            let arr = [];
            arr.push(this.roleValue);
            return arr;
        }
    },
    methods: {
        checkPhone(e) {
            if (e < 0) {
                this.formData.phone = 0 - e;
            }
            if (e.length > 11) {
                let str = e
                    .split("")
                    .splice(0, 11)
                    .join("");
                console.log("TCL: checkPhone -> str", str);
                this.$nextTick(() => {
                    this.formData.phone = str;
                });
            }
        },
        getRoleList() {
            this.$http
                .get(
                    this.$api.permissionRoleList,
                    { limit: 1000, page: 1 },
                    true
                )
                .then(res => {
                    this.roleList = res.data;
                    this.setRoleValue(res.data);
                })
                .catch(err => {
                    this.$message.error("获取角色列表失败");
                });
        },
        setRoleValue(roleList) {
            if (!this.item.role) return;
            let { role } = this.item;
            for (let key in roleList) {
                if (role[0] == roleList[key].name) {
                    this.roleValue = roleList[key].id;
                    return;
                }
            }
        },
        getDetail() {
            console.log(
                "​getDetail -> this.item",
                this.item,
                Object.prototype.toString.call(this.item)
            );
            let {
                provinceCode = null,
                cityCode = null,
                districtCode = null,
                realName = null,
                phone = null
            } = this.item;
            this.area = [provinceCode, cityCode, districtCode];
            this.formData = { realName, phone };
        },
        add() {
            console.log("click add");
            let data = {
                ...this.formData,
                ...this.mArea,
                roleIds: this.roleIds
            };
            console.log("​add -> data", data);
            if (Object.keys(this.formData).length != 3) {
                this.$message.warning("请补全信息");
                return;
            } else {
                var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                for (let key in this.formData) {
                    if (!this.formData[key]) {
                        this.$message.warning("请补全信息");
                        return;
                    }
                    if (key == "phone" && !myreg.test(this.formData[key])) {
                        this.$message.warning("账号请使用11位手机号码");
                        return;
                    }
                    if (key == "password" && this.formData[key].length < 5) {
                        this.$message.warning("密码需要5位以上");
                        return;
                    }
                }
            }
            if (!this.roleIds[0]) {
                this.$message.warning("请补全角色");
                return;
            }
            if (!(this.area.length > 0)) {
                this.$message.warning("请补全地区");
                return;
            }
            this.loading = true;
            if (Object.keys(this.item).length) {
                this.api = this.$api.permissionAccountModify;
                data.uid = this.item.userId;
            } else {
                this.api = this.$api.permissionAccountCreate;
            }

            this.$http
                .post(this.api, data, true)
                .then(res => {
                    console.log("​add -> res", res);
                    this.$notify({
                        title: "提示",
                        message: "成功",
                        type: "success"
                    });
                    this.open = false;
                    this.loading = false;
                    this.$emit("success");
                })
                .catch(err => {
                    console.log("​add -> err", err);
                    this.$notify({
                        title: "提示",
                        message: `失败,${err.message}`,
                        type: "warning"
                    });
                    this.loading = false;
                });
        },
        text2password(e) {
            e.target.type = "password";
        }
    }
};
</script>
<style lang="scss" scoped>
</style>


