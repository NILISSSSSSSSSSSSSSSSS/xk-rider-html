
<template>
    <div class="editor-container">
        <el-radio-group size='mini' v-model="editorWidth" v-if='setting.changeWidth'>
            <el-radio-button v-model='editorWidth' v-for='item in widthList' :key='item.value' :label='item.value'>{{item.name}}</el-radio-button>
        </el-radio-group>
        <div class="editor" :style='{width:(editorWidth||setting.width)+"px"}' style='transition:all .5s linear'>
            <quill-editor class="quill-editor-style" style='flex:1' v-model='contentInside' :options='editorOption'
                modal-append-to-body ref="editor" :disabled='disabled'></quill-editor>
        </div>
        <transition name="fade-transverse">
            <img-upload v-if='uploadImg' :show.sync='uploadImg' @success='insertImg'></img-upload>
        </transition>
    </div>
</template>
<script>
// 富文本quill样式
// import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
// 未使用bubble样式
// import "quill/dist/quill.bubble.css";
import Quill from "quill";
import { quillEditor } from "vue-quill-editor";
// import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
import ImageResize from "quill-image-resize-module";
// 图片上传
// Quill.register("modules/ImageExtend", ImageExtend);
// use resize module
// 图片大小设置 在手机屏幕宽度之外均显示为100%宽度   以iphone6 375 为例
Quill.register("modules/ImageResize", ImageResize);

// import {
//     getQiNiuToken,
//     getSession
// } from "./../../util/publicMehotds.js";
import { uploadPath, previewPath } from "./../../util/publicParams.js";
import ImgUpload from "./ImgUpload";
export default {
    components: {
        quillEditor,
        ImgUpload
    },
    props: {
        value: {
            type: String
        },
        title: {
            type: String,
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: ""
        },
        setting: {
            type: Object,
            default: { changeWidth: false, width: null }
        }
    },
    data() {
        let that = this;
        // 拼接HTML内容
        let html1 =
            '<html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>';
        let html2 = "</title>";
        let html3 = `</head><body><div class="ql-editor">`;
        let html4 = `</div></body></html>`;
        // 样式cdn链接
        let quillStyle =
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.6/quill.core.css"/><style>img{max-width:100%;}</style>';
        let widthList = [
            { value: 320, name: "iPhone 5s" },
            { value: 375, name: "iPhone 7" },
            { value: 414, name: "iPhone 7 plus" },
            { value: 360, name: "Android" },
            { value: 0, name: "不使用手机宽度" }
        ];
        return {
            widthList,
            editorWidth: 0,
            token: "",
            html1,
            html2,
            html3,
            html4,
            quillStyle,
            showAdd: false,
            contentInside: this.value,
            edited: false,
            mContent: "",
            uploadImg: false,
            insertIndex: 0,
            editorOption: {
                placeholder: that.placeholder || "请输入内容",
                modules: {
                    ImageResize: {},
                    // ImageExtend: {
                    //     loading: true,
                    //     // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入
                    //     name: "file", // 图片参数名
                    //     // size: 3, // 可选参数 图片大小，单位为M，1M = 1024kb
                    //     action: uploadPath, // 服务器地址, 如果action为空，则采用base64插入图片
                    //     // response 为一个函数用来获取服务器返回的具体图片地址
                    //     // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
                    //     // 则 return res.data.url
                    //     response: res => {
                    //         console.log("url_img", res.key);
                    //         // return `http://zb.xksquare.com/${res.key}`;
                    //         return `${previewPath}${res.key}`;
                    //     },
                    //     // headers: xhr => {
                    //     // xhr.setRequestHeader('myHeader','myValue')
                    //     // }, // 可选参数 设置请求头部
                    //     sizeError: () => {
                    //         that.$message.warning("请上传3M内大小的图片");
                    //     }, // 图片超过大小的回调
                    //     start: () => {}, // 可选参数 自定义开始上传触发事件
                    //     end: () => {}, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
                    //     error: async () => {
                    //         that.getToken();
                    //     }, // 可选参数 上传失败触发的事件
                    //     success: () => {}, // 可选参数  上传成功触发的事件
                    //     change: async (xhr, formData) => {
                    //         formData.append("token", that.token);
                    //     } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
                    // },
                    toolbar: {
                        // 如果不上传图片到服务器，此处不必配置
                        container: [
                            ["bold", "italic", "underline", "strike"],
                            ["blockquote", "code-block"],
                            [{ header: 1 }, { header: 2 }],
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ script: "sub" }, { script: "super" }],
                            [{ indent: "-1" }, { indent: "+1" }],
                            [{ direction: "rtl" }],
                            [{ size: [false, "small", "large", "huge"] }],
                            [{ font: [] }],
                            [{ color: [] }, { background: [] }],
                            [{ align: [] }],
                            ["link", "image", "video"],
                            ["clean"],
                            ["undo", "redo"]
                        ], // container为工具栏，此次引入了全部工具栏，也可自行配置
                        handlers: {
                            // 添加图片
                            image: function(value) {
                                // 劫持原来的图片点击按钮事件
                                // QuillWatch.emit(this.quill.id);
                                that.insertIndex = that.qEditor.getSelection().index;
                                that.uploadImg = true;
                            },
                            // 后退
                            undo: function() {
                                this.quill.history.undo();
                            },
                            // 前进
                            redo: function() {
                                this.quill.history.redo();
                            },
                            // 添加链接
                            link: function(value) {
                                if (value) {
                                    // that.$prompt("请输入URL", "提示", {
                                    //     confirmButtonText: "确定",
                                    //     cancelButtonText: "取消"
                                    // })
                                    //     .then(({ value }) => {
                                    //         let href = value;
                                    //         if (!href.startsWith("http")) {
                                    //             href = "http://" + href;
                                    //         }
                                    //         if (
                                    //             !/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(
                                    //                 href
                                    //             )
                                    //         ) {
                                    //             that.$message.error(
                                    //                 "请输入正确的URL"
                                    //             );
                                    //             return;
                                    //         }
                                    //         this.quill.format("link", href);
                                    //     })
                                    //     .catch(err => {
                                    //         console.log(
                                    //             "TCL: data -> err",
                                    //             err
                                    //         );
                                    //         that.$message.info("已经取消输入");
                                    //     });
                                    var href = prompt("请输入URL");
                                    // 如果没有http, 补全;
                                    if (!href.startsWith("http")) {
                                        href = "http://" + href;
                                    }
                                    if (
                                        !/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(
                                            href
                                        )
                                    ) {
                                        that.$message.error("请输入正确的URL");
                                        return;
                                    }
                                    this.quill.format("link", href);
                                } else {
                                    this.quill.format("link", false);
                                }
                            }
                        }
                    }
                }
            }
        };
    },
    created() {
        // this.getToken();
    },
    computed: {
        newContent() {
            let str =
                this.html1 +
                // 会读取title的文本,所以去掉
                // this.title +
                this.html2 +
                this.quillStyle +
                this.html3 +
                this.mContent +
                this.html4;
            return str;
        },
        qEditor() {
            return this.$refs.editor.quill;
        }
    },
    watch: {
        contentInside(html) {
            let str = html
                .replace(this.html1, "")
                .replace(this.html2, "")
                .replace(this.html3, "")
                .replace(this.html4, "");
            this.mContent = str;
            let length = this.$refs.editor.quill.getLength();
            if (length > 1) {
                if (!this.edited) {
                    this.setIcon();
                }
                this.edited = true;
                this.$emit("input", this.newContent);
            } else {
                this.edited = false;
                // this.clearIcon();
                this.$emit("input", "");
            }
            this.$emit("edited", this.edited);
        }
    },
    methods: {
        // async getToken() {
        //     if (!this.disabled) {
        //         this.token = await getQiNiuToken();
        //     }
        // },
        insertImg(url) {
            console.log(this.qEditor);
            this.qEditor.insertEmbed(this.insertIndex, "image", url);
            this.uploadImg = false;
        },
        setIcon() {
            let undo = document.querySelector(".ql-undo");
            let redo = document.querySelector(".ql-redo");
            if (undo.className.indexOf("icon-triangle-left") == -1) {
                // undo.className += " el-icon-caret-left";
                // redo.className += " el-icon-caret-right";
                undo.className += " icon-triangle-left";
                redo.className += " icon-triangle-right";
            }
        }
        // clearIcon() {
        //     let undo = document.querySelector(".ql-undo");
        //     let redo = document.querySelector(".ql-redo");
        //     undo.className = "ql-undo";
        //     redo.className = "ql-redo";
        // }
    }
};
</script>
<style lang="scss" scoped>
.editor-container {
    position: relative;
}

.editor {
    border-radius: 7px;
    overflow: hidden;
}
.el-radio-group {
    margin-bottom: 10px;
    label {
        padding: 0 !important;
        min-width: 50px !important;
    }
}
.quill-editor-style {
    background: #fff;
    // color: #fff;
    /deep/ .ql-blank,
    /deep/ .ql-editor {
        min-height: 350px;
    }
    /deep/ .ql-container {
        max-height: 550px;
        overflow: auto;
    }
    // /deep/ * {
    //     stroke: #fff;
    //     color: #fff;
    // }
    // /deep/ .ql-editor.ql-blank::before{
    //     color:#ddd;
    // }
    /deep/ .ql-undo,
    /deep/ .ql-redo {
        font-size: 20px;
        line-height: 20px;
    }
}
</style>
