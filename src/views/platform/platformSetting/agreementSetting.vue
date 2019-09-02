
<template>
    <div class="agreement-setting rider-container">
        <div class="rider-switch">
            <div class="tab active">新增平台协议</div>
            <div class="close-form-btn">
                <span class="text-blue point-style" @click='$router.go(-1)'>返回上一级</span>
            </div>
        </div>
        <!-- <div class="publish">
            <el-button @click='showAdd=true'>发布平台协议</el-button>
        </div> -->
        <!-- <el-dialog
            :visible.sync="showAdd"
            title='发布平台协议'
            center
        > -->
        <el-form class="rider-form" label-width="80px" label-position="center">
            <div class="line-start-start">
                <div class="label">标题:</div>
                <el-input :size='$size' style='width:800px;' class="input-250" placeholder="请输入协议标题" @input='changeInput'
                    v-model='formData.title'></el-input>
            </div>
            <!-- <div class="line-start-start">
                <div class="label">简称:</div>
                <el-input :size='$size' style='flex:1' class="input-250" placeholder="请输入协议简称" v-model='formData.title'></el-input>
            </div> -->
            <div class="line-start-start margin-top-20">
                <div class="label">内容:</div>
                <!-- <quill-editor class="quill-editor-style" style='flex:1' v-model='formData.content' :options='editorOption'
                    modal-append-to-body :disabled='type=="read"'></quill-editor> -->
                <Editor :title='formData.title' :setting='{width:800}' @input='changeInput' v-model='formData.content'></Editor>
                <!-- <Tiny @input='changeInput' v-model='formData.content'></Tiny> -->
            </div>
            <div class="footer margin-top-20" v-if='type!="read"'>
                <el-button type='primary' @click="modifyAgreement" :disabled="!editStatus">发布</el-button>
            </div>
        </el-form>
        <!-- </el-dialog> -->
    </div>
</template>
<script>
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";
// import Quill from "quill";
// import { quillEditor } from "vue-quill-editor";
// import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
// import ImageResize from "quill-image-resize-module";

// Quill.register("modules/ImageExtend", ImageExtend);
// // use resize module
// Quill.register("modules/ImageResize", ImageResize);
// let html1 =
//     '<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>';
// let html2 = "</title>";
// let html3 = `</head><body><div class="ql-editor">`;
// let html4 = `</div></body></html>`;
// let quillStyle =
//     '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.6/quill.core.css"/>';
import { getSession } from "./../../../util/publicMehotds.js";
// import { uploadPath, previewPath } from "./../../../util/publicParams.js";
import Editor from "./../../../components/all/Editor";
// import Tiny from "./../../../components/Tinymce.vue";
export default {
    components: {
        // quillEditor,
        Editor
        // Tiny
    },
    data() {
        return {
            showAdd: false,
            formData: { title: "", content: "" },
            editStatus: false
        };
    },
    created() {
        console.log("编号", this.$route.query.num);
        this.selectAgreement();
    },

    computed: {
        type() {
            return this.$route.query.type;
        },
        list() {
            let arr = [];
            if (this.$store.state.agreement.list.length) {
                arr = this.$store.state.agreement.list;
            } else {
                arr = JSON.parse(getSession("agreement_list")) || [];
            }
            return arr;
        }
        // newContent() {
        //     return (
        //         this.html1 +
        //         this.formData.title +
        //         this.html2 +
        //         this.quillStyle +
        //         this.html3 +
        //         this.formData.content +
        //         this.html4
        //     );
        // }
    },
    methods: {
        changeInput(val) {
            let { title, content } = this.formData;
            if (title && content) {
                this.editStatus = true;
                return;
            }
            this.editStatus = false;
        },
        getStatus(val) {
            this.editStatus = val;
        },
        selectAgreement() {
            let list = this.list;
            if (list.length) {
                for (let i of list) {
                    if (i.number == this.$route.query.num) {
                        let { title, content, number } = i;
                        this.formData = {
                            title,
                            content,
                            number
                        };
                    }
                }
            }
        },
        modifyAgreement() {
            this.$http
                .post(
                    this.$api.platformAgreementSetting,
                    { ...this.formData },
                    true
                )
                .then(res => {
                    console.log("​modifyAgreement -> res", res);
                    this.$router.go(-1);
                })
                .catch(err => {
                    console.log("​modifyAgreement -> err", err);
                    this.$message.error("编辑失败 错误码" + err.code);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.label {
    width: 80px;
    color: #fff;
    text-align: right;
    padding-right: 12px;
    font-size: 14px;
}

// .quill-editor-style {
//     background: #fff;
//     // color: #fff;
//     /deep/ .ql-blank,
//     /deep/ .ql-editor {
//         min-height: 450px;
//     }
//     // /deep/ * {
//     //     stroke: #fff;
//     //     color: #fff;
//     // }
//     // /deep/ .ql-editor.ql-blank::before{
//     //     color:#ddd;
//     // }
// }
.footer {
    width: 880px;
    padding-left: 90px;
    text-align: left;
}
</style>
