<template>
    <div class="tinymce-editor" style='transition:all .5s linear' :style='{width:(editorWidth||setting.width)+"px"}'>
        <el-select size='small' v-model='editorWidth' v-if='setting.settingWidth'>
            <el-option v-for='item in widthList' :key='item.value' :value='item.value' :label='item.name'></el-option>
        </el-select>
        <Editor :init="editorInit" v-model="tinyInput" :disabled='$attrs.disabled'></Editor>
    </div>
</template>

<script>
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver";
import Editor from "@tinymce/tinymce-vue";

// 插件
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/link";
import "tinymce/plugins/importcss";
import "tinymce/plugins/preview";

import { uploadPath, previewPath } from "./../util/publicParams.js";
import { getQiNiuToken, getSession } from "./../util/publicMehotds.js";
export default {
    props: {
        value: {
            type: String,
            default: ""
        },
        setting: {
            type: Object,
            default: () => {
                return { settingWidth: true, width: 800, height: 500 };
            }
        }
    },
    components: {
        Editor
    },
    created() {
        this.getToken();
        tinymce.init({});
    },
    // mounted() {},
    data() {
        let that = this;
        // let header1 =
        //     '<html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title></title>';
        let style = `<style>.tiny-container{overflow-y:auto;}.tiny-container div,.tiny-container p,.tiny-container h1,.tiny-container h2,.tiny-container h3,.tiny-container h4,.tiny-container h5,.tiny-container h6 {max-width: 100% !important;word-wrap: break-word !important;word-break: normal !important;white-space: pre-wrap !important;}.tiny-container img {max-width: 100%;}.tiny-container pre{overflow:auto}</style><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><section class="tiny-container">`;
        // let header2 = `</head><body>`;
        let end = `</section>`;
        // let end = `</body></html>`;
        let widthList = [
            { value: 320, name: "320 iPhone 5s" },
            { value: 375, name: "375 iPhone 7" },
            { value: 414, name: "414 iPhone 7 plus" },
            { value: 360, name: "360 Android" },
            { value: 0, name: "800 默认宽度" }
        ];
        // 根据环境修改路径
        let envPath = process.env.NODE_ENV === "production" ? "/rider/" : "/";
        return {
            widthList,
            // header1,
            // header2,
            style,
            end,
            editorWidth: 0,
            token: "",
            tinyInput: this.value,
            mInput: "",
            editorInit: {
                resize: true, //允许拖动修改编辑器高度
                toolbar_drawer: "sliding",
                language_url: `${envPath}tinymce/zh_CN.js`, // 语言包的路径
                language: "zh_CN", //语言
                skin_url: `${envPath}tinymce/skins/ui/oxide`, // skin路径
                content_css: `${envPath}tinymce/my-styles.css`,
                image_dimensions: false, //图片预处理
                importcss_append: true, //默认外部css样式
                height: this.setting.height || 500, //编辑器高度
                branding: false, //是否禁用“Powered by TinyMCE”
                menubar: false, //顶部菜单栏显示,
                fontsize_formats:
                    "11px 12px 14px 16px 18px 20px 22px 24px 30px 36px 48px",
                plugins: "preview link lists image media table wordcount",
                toolbar:
                    "formatselect fontselect fontsizeselect| alignleft aligncenter alignright alignjustify  | bold italic strikethrough forecolor backcolor | subscript superscript | bullist numlist outdent indent | blockquote link lists image media table | preview removeformat undo redo",
                images_upload_handler: function(blobInfo, success, failure) {
                    var xhr, formData;
                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open("POST", uploadPath);
                    xhr.onload = function() {
                        var json;
                        if (xhr.status != 200) {
                            failure("HTTP Error: " + xhr.status);
                            return;
                        }
                        json = JSON.parse(xhr.responseText);
                        if (!json || typeof json.key != "string") {
                            failure("Invalid JSON: " + xhr.responseText);
                            return;
                        }
                        success(previewPath + json.key);
                    };
                    formData = new FormData();
                    formData.append("file", blobInfo.blob());
                    formData.append("token", that.token);
                    xhr.send(formData);
                }
            }
        };
    },
    computed: {
        sendInput() {
            if (!this.mInput) return "";
            return (
                // this.header1 +
                this.style +
                // this.header2 +
                this.mInput +
                this.end
            );
        }
    },
    watch: {
        tinyInput(val) {
            let str = val
                .replace(this.style, "")
                .replace(this.end, "")
                .replace(/<section class="tiny-container">/g, "");
            this.mInput = str;
            if (val) {
                this.$emit("input", this.sendInput);
            } else {
                this.$emit("input", "");
            }
            this.$emit("edited", true);
            if (val.length == 0) {
                this.$emit("edited", false);
            }
        }
    },
    methods: {
        // 获取七牛token
        async getToken() {
            this.token = await getQiNiuToken();
        }
    }
};
</script>

<style lang="scss" scoped>
.el-select {
    margin-bottom: 10px;
}
.tinymce-editor {
    /deep/ .tox-tinymce {
        border-radius: 3px;
    }
}
</style>
