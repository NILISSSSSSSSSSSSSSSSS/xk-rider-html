<template>
    <div class="publish rider-container" v-if='reload'>
        <div class="rider-switch">
            <div class="tab active">{{$route.query.type=='modify'?"修改发布内容":"新建发布内容"}} {{canPublish?"":"( 没有新建权限 )"}}</div>
        </div>
        <div class="rider-form">
            <!-- <Editors v-model='formData.content'></Editors> -->
            <el-form label-width="120px" :model='formData' :rules="rules" :disabled="type=='detail'">
                <div class="line-flex-start">
                    <span>推送内容:</span>
                    <el-select :size='$size' v-model='formData.activeType' class="margin-right-20 input-350">
                        <el-option v-for="(item,index) in activeType" :key='index' :value='item.value' :label='item.label'></el-option>
                    </el-select>
                    <span>推送时间:</span>
                    <el-date-picker :size='$size' style='border-radius:7px' class="input-350" v-model="formData.pushAt"
                        type="datetime" placeholder="选择日期时间" @input='changeInput'>
                    </el-date-picker>
                </div>
                <div class="line-flex-start">
                    <span>推送标题:</span>
                    <el-input :size='$size' class="input-800" v-model='formData.title' @input='changeInput' placeholder="请输入推送标题"></el-input>
                </div>
                <div class="line-start-start">
                    <span>推送副标题:</span>
                    <el-input :size='$size' class="input-800" type="textarea" @input='changeInput' v-model='formData.subTitle'
                        placeholder="请输入推送副标题"></el-input>
                </div>
                <div class="line-start-start">
                    <span>推送内容:</span>
                    <Editor :title='formData.title' style='max-width:80%;' :key='refresh' v-model="formData.content"
                        :setting="{width:800}" @input='changeInput' :disabled="type=='detail'"></Editor>
                    <!-- <Tiny v-model="formData.content" @input='changeInput' :setting="{height:400,width:800,settingWidth:true}"
                        :disabled="type=='detail'" :key='refresh'></Tiny> -->
                </div>
                <!-- <div class="line-flex-start">
                    <span>添加H5外链:</span> -->
                <!-- <el-form-item label='添加H5外链:' prop='h5Url'>
                    <el-input :size='$size' type='url' class="input-350" v-model='formData.h5Url' placeholder="http://xxx.xxxxx.xxx"></el-input>
                </el-form-item> -->
                <!-- </div> -->
                <el-form-item class="btn-group" label=' ' v-if='type!="detail"'>
                    <el-button :size='$size' class='rider-btn' type='primary' @click="publish()" :disabled="!editStatus">确定</el-button>
                    <el-button :size='$size' class="rider-btn cancel" @click='resetForm()'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import moment from "moment";
// import Editors from "./../../../../components/all/EditorStandBy";
import { mapMutations } from "vuex";
import { getSession, saveSession } from "./../../../../util/publicMehotds.js";
import { canUse, publish } from "./../../../../menu/permission.js";
import Editor from "./../../../../components/all/Editor";
// import Tiny from "./../../../../components/Tinymce";
export default {
    components: {
        Editor
        // Tiny
        // Editors
    },
    data() {
        let activeType = [
            { label: "活动", value: "active" },
            { label: "公告", value: "notice" }
        ];
        return {
            canPublish: publish,
            activeType,
            editStatus: false,
            refresh: new Date().getTime(),
            reload: true,
            formData: {
                pushAt: "",
                title: "",
                subTitle: "",
                content: "",
                h5Url: "暂时无用",
                activeType: "notice"
            },
            rules: {
                h5Url: {
                    type: "url",
                    message: "请输入正确网址",
                    trigger: "change"
                }
            }
        };
    },
    computed: {
        mFormData() {
            let { pushAt } = this.formData;
            let time = moment(pushAt).format("X");
            console.log(pushAt, time);
            return {
                ...this.formData,
                pushAt: time
            };
        },
        type() {
            return this.$route.query.type;
        }
    },
    created() {
        console.log(this.$route.query);
        if (this.$route.query.type == "modify") {
            this.getDetail();
        }
    },
    destroyed() {
        this.saveDetail(null);
        sessionStorage.removeItem("publishDetail");
    },
    watch: {
        type(newV) {
            console.log("​type -> newV", newV);
            if (!newV) {
                this.saveDetail(null);
                sessionStorage.removeItem("publishDetail");
                this.formData = {
                    pushAt: "",
                    title: "",
                    subTitle: "",
                    content: "",
                    h5Url: "",
                    activeType: "notice"
                };
            }
            this.reload = false;
            this.$nextTick(() => {
                this.reload = true;
            });
        }
    },
    methods: {
        ...mapMutations({
            saveDetail: "publish/saveDetail"
        }),
        changeInput(val) {
            let { pushAt, title, subTitle, content } = this.formData;
            if (pushAt && title && subTitle && content) {
                this.editStatus = true;
                return;
            }
            // if (val.length > 0) {
            //     this.editStatus = true;
            //     return;
            // }
            this.editStatus = false;
        },
        getDetail() {
            console.log(this.$store.state.publish.detail);
            // vuex或者缓存中获取,防止当前页面刷新之后遗失数据
            let obj = this.$store.state.publish.detail
                ? this.$store.state.publish.detail
                : JSON.parse(getSession("publishDetail"));
            if (obj) {
                console.log("TCL: getDetail -> obj", obj);
                if (this.$route.query.type == "detail") {
                    let {
                        status,
                        h5Url,
                        title,
                        content,
                        pushTime,
                        subTitle
                    } = obj;
                    this.formData = {
                        h5Url,
                        content,
                        subTitle,
                        title,
                        activeType: status,
                        pushAt: moment.unix(pushTime)
                    };
                } else if (this.$route.query.type == "modify") {
                    console.log("​getDetail -> obj", obj);
                    let {
                        id,
                        status,
                        h5Url,
                        title,
                        content,
                        pushTime,
                        subTitle
                    } = obj;
                    this.formData = {
                        id,
                        h5Url,
                        content,
                        subTitle,
                        title,
                        activeType: status,
                        pushAt: moment.unix(pushTime)
                    };
                }
            }
        },
        getEditStatus(val) {
            this.editStatus = val;
        },
        resetForm() {
            let data = {
                pushAt: "",
                title: "",
                subTitle: "",
                content: "",
                h5Url: "",
                activeType: "notice"
            };
            console.log("TCL: resetForm -> data", data);

            this.formData = { ...this.formData, ...data };
            this.editStatus = false;
            this.refresh = new Date().getTime();
        },
        publish() {
            let api = null;
            if (this.type == "modify") {
                if (!canUse("pushContentUpdate")) return;
                api = this.$api.platformPublishUpdate;
            } else {
                if (!canUse("publish")) return;
                api = this.$api.platformPublish;
            }
            for (let key in this.formData) {
                if (this.formData.hasOwnProperty(key)) {
                    let item = this.formData[key];
                    if (!item) {
                        switch (key) {
                            case "pushAt":
                                this.$message.warning("请选择推送时间");
                                return;
                            case "title":
                                this.$message.warning("请输入推送标题");
                                return;
                            case "subTitle":
                                this.$message.warning("请输入推送副标题");
                                return;
                            case "content":
                                this.$message.warning("请输入推送内容");
                                return;
                            // case "h5Url":
                            //     this.$message.warning("请输入推送外链");
                            //     return;
                            default:
                                break;
                        }
                    }
                }
            }

            this.$http
                .post(api, this.mFormData, true)
                .then(res => {
                    console.log("​publish -> res", res);
                    this.$notify.success({
                        title: "消息",
                        message: "发布成功"
                    });
                    this.$router.replace({ name: "pushDetailManage" });
                })
                .catch(err => {
                    console.log("​publish -> err", err);
                    this.$notify.warning({
                        title: "消息",
                        message: "发布失败"
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.line-flex-start,
.line-start-start {
    margin: 0 !important;
    padding-bottom: 30px;
    span:first-child {
        width: 120px;
    }
}
.input-350 {
    width: 350px;
}
.input-800 {
    width: 800px;
}
// .btn-group {
//     margin-top: 30px;
// }
</style>

