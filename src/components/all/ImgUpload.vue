<template>
    <div class="img-upload" @click.self='open=false'>
        <el-tabs type="border-card">
            <el-tab-pane label="输入图片地址" class="line-flex-start">
                <el-input class="margin-right-10" v-model='inputUrl' :size='$size' placeholder="请输入图片地址"></el-input>
                <el-button :size='$size' type='primary' @click='sendInput'>插入</el-button>
            </el-tab-pane>
            <el-tab-pane label="上传图片">
                <el-upload class="avatar-uploader" drag :data='uploadData' :action="uploadPath" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :on-error="getToken" :before-upload="beforeAvatarUpload">
                    <!-- <img v-if="imgPath" :src="imgPath" class="avatar"> -->
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { uploadPath, previewPath } from "./../../util/publicParams.js";
import { getQiNiuToken } from "./../../util/publicMehotds.js";
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            uploadPath,
            previewPath,
            uploadData: {},
            imgPath: "",
            open: this.show,
            inputUrl: ""
        };
    },
    watch: {
        open(val) {
            if (!val) {
                this.$emit("update:show", val);
            }
        },
        show(val) {
            this.open = val;
        }
    },
    created() {
        this.getToken();
    },
    methods: {
        async getToken() {
            this.uploadData.token = await getQiNiuToken();
        },
        handleAvatarSuccess(res, file) {
            this.imgPath = previewPath + file.response.key;
            this.$emit("success", this.imgPath);
        },
        beforeAvatarUpload(file) {
            const isPNG = file.type.indexOf("image") !== -1;
            console.log("TCL: beforeAvatarUpload -> isPNG", isPNG);
            const isLt3M = file.size / 1024 / 1024 < 3;
            if (!isPNG) {
                this.$message.error("上传图片只能是图片格式!");
            }
            if (!isLt3M) {
                this.$message.error("上传图片大小不能超过 3MB!");
            }
            return isPNG && isLt3M;
        },
        sendInput() {
            if (this.inputUrl) {
                this.$emit("success", this.inputUrl);
            } else {
                this.$message.error("请输入图片地址");
            }
        }
    }
};
</script>
<style lang="scss" scoped>
// @function add($num) {
//     $color: ();
//     @for $i from 1 through $num {
//         $x: 0 #{$i}px #{$i}px 0 rgba($i * 3, $i * 3, $i * 3, 0.01 * $i);
//         $color: append($color, $x, comma);
//     }
//     @return $color;
// }
// .xxx {
//     box-shadow: add(100);
// }
$up-width: 286px;
$up-height: 48px;
.img-upload {
    width: 100%;
    height: 100%;
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}
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
    width: $up-width;
    height: $up-height;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: $up-width;
    height: $up-height;
    line-height: $up-height;
    text-align: center;
    border: 1px dashed #d9d9d9;
}
// .avatar {
//     width: 178px;
//     height: 178px;
//     display: block;
// }
// .logo-con {
//     width: 50px;
//     height: 50px;
//     text-align: center;
//     background: #fff;
//     margin: 0 auto;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border-radius: 7px;
//     .logo {
//         width: 40px;
//     }
// }
</style>

