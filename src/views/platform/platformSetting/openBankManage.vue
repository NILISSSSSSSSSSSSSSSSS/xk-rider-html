<template>
    <div class="open-bank-manage rider-container">
        <div class="rider-switch">
            <div class="tab active">开户行管理</div>
            <div class="close-form-btn">
                <el-button class="add" :size='$size' type='primary' @click='newBank' v-if='bankCreate'>新增开户行</el-button>
            </div>
        </div>

        <div class="rider-table">
            <el-table :data='tableData' fit v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'>
                <el-table-column label='开户行LOGO' width='200'>
                    <template slot-scope='scope'>
                        <div class="logo-con">
                            <img class="logo" :src="scope.row.bankLog" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label='开户行名称' prop='bankName'></el-table-column>
                <el-table-column label='操作'>
                    <template slot-scope='scope'>
                        <div>
                            <el-button :size='$size' type='primary' @click='updateBank(scope.row)'>编辑</el-button>
                            <el-button type='danger' :size='$size' @click='deleteBank(scope.row.id)'>删除</el-button>
                        </div>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <Pagination :form="formData" :total="total" @page='getPage'></Pagination>
        <el-dialog :close-on-click-modal="false" :title='submitData.bankName?"修改开户行":"新增开户行"' :visible.sync="showAdd"
            width='500px' append-to-body>
            <el-form label-width="120px">
                <el-form-item label='开户行名称:'>
                    <el-input :size='$size' v-model="submitData.bankName"></el-input>
                </el-form-item>
                <el-form-item label='开户行LOGO:'>
                    <el-upload class="avatar-uploader" drag :data='uploadData' :action="uploadPath" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :on-error="getToken()" :before-upload="beforeAvatarUpload">
                        <img v-if="submitData.bankLog" :src="submitData.bankLog" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button :size='$size' type='primary' @click="submit" :disabled="!submitData.bankName||!submitData.bankLog">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { uploadPath, previewPath } from "./../../../util/publicParams.js";
import { getQiNiuToken } from "./../../../util/publicMehotds.js";
import { canUse, bankCreate } from "./../../../menu/permission.js";
export default {
    data() {
        return {
            uploadPath,
            previewPath,
            bankCreate,
            showAdd: false,
            addType: "new",
            imageUrl: "",
            tableData: [],
            loading: false,
            total: 0,
            formData: { page: 1, limit: 10 },
            imageUrl: "",
            uploadData: {},
            submitData: {
                bankName: "",
                bankLog: ""
            }
        };
    },
    created() {
        this.getToken();
    },
    methods: {
        async getToken() {
            this.uploadData.token = await getQiNiuToken();
        },
        newBank() {
            if (!canUse("bankCreate")) return;
            this.addType = "new";
            this.submitData = { bankName: "", bankLog: "" };
            this.showAdd = true;
        },
        getList() {
            this.loading = true;
            this.$http
                .get(this.$api.platformBankList, this.formData, true)
                .then(res => {
                    console.log("TCL: getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        },
        getPage(val) {
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        handleAvatarSuccess(res, file) {
            console.log("TCL: handleAvatarSuccess -> file", file);
            console.log("TCL: handleAvatarSuccess -> res", res);
            this.submitData.bankLog = this.previewPath + file.response.key;
        },
        beforeAvatarUpload(file) {
            const isPNG = file.type.indexOf("image") !== -1;
            console.log("TCL: beforeAvatarUpload -> isPNG", isPNG);
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isPNG) {
                this.$message.error("上传图片只能是 PNG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isPNG && isLt2M;
        },
        submit() {
            let data = this.submitData;
            let api = "";
            if (this.addType == "update") {
                if (!canUse("bankUpdate")) return;
                api = this.$api.platformBankUpdate;
            }
            if (this.addType == "new") {
                if (!canUse("bankCreate")) return;
                api = this.$api.platformBankCreate;
            }
            if (!data.bankName) {
                this.$message.warning("请输入开户行名称");
                return;
            }
            if (!data.bankLog) {
                this.$message.warning("请上传logo");
                return;
            }
            this.$http
                .post(api, data, true)
                .then(res => {
                    this.$notify({
                        title: "提示",
                        message: "提交成功",
                        type: "success"
                    });
                    this.showAdd = false;
                    this.submitData = {};
                    this.getList();
                })
                .catch(err => {
                    this.$notify({
                        title: "提示",
                        message: "提交失败",
                        type: "warning"
                    });
                });
        },
        updateBank(bank) {
            if (!canUse("bankUpdate")) return;
            let { bankName, bankLog, id } = bank;
            this.submitData = { bankName, bankLog, id };
            this.addType = "update";
            this.showAdd = true;
        },
        deleteBank(bid) {
            if (!canUse("bankDelete")) return;
            let data = { id: bid };
            this.$confirm("是否继续删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$http
                        .post(this.$api.platformBankDelete, data, true)
                        .then(res => {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.getList();
                        })
                        .catch(err => {
                            this.$message({
                                type: "error",
                                message: "删除失败!"
                            });
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
/deep/ .el-upload-dragger {
    width: 178px;
    height: 178px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.logo-con {
    width: 50px;
    height: 50px;
    text-align: center;
    background: #fff;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    .logo {
        width: 40px;
    }
}
</style>

