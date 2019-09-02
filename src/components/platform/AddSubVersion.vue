<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="open" top='10vh' width='500px' :title='`${Object.keys(item).length==0?"新增":"修改"}客户端子版本`'>
        <el-form label-width='120px'>
            <el-form-item label='客户端版本号：'>
                {{formData.defVersion|formatVersion}}
            </el-form-item>
            <el-form-item label='最大版本号：'>
                <div class="line-start-start">
                    <el-input ref='v1' v-model='maxV1' type='number' @input='checkLength("maxV1",$event)' :size='$size'></el-input>&nbsp;.&nbsp;
                    <el-input ref='v2' v-model='maxV2' type='number' @input='checkLength("maxV2",$event)' :size='$size'></el-input>&nbsp;.&nbsp;
                    <el-input ref='v3' v-model='maxV3' type='number' @input='checkLength("maxV3",$event)' :size='$size'></el-input>
                </div>
            </el-form-item>
            <el-form-item label='最小版本号：'>
                <div class="line-start-start">
                    <el-input ref='v4' v-model='minV1' type='number' @input='checkLength("minV1",$event)' :size='$size'></el-input>&nbsp;.&nbsp;
                    <el-input ref='v5' v-model='minV2' type='number' @input='checkLength("minV2",$event)' :size='$size'></el-input>&nbsp;.&nbsp;
                    <el-input ref='v6' v-model='minV3' type='number' @input='checkLength("minV3",$event)' :size='$size'></el-input>
                </div>
            </el-form-item>
            <el-form-item label='安装包大小：'>
                <el-input v-model='formData.appSize' type='number' @input='gtZero("appSize",$event)'>
                    <i slot="suffix">MB</i>
                </el-input>
            </el-form-item>
            <el-form-item label='更新方式：'>
                <el-select v-model='formData.updateType'>
                    <el-option v-for='item in newUpdateType' :key='item.value' :label='item.label' :value='item.value'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='强制更新：'>
                <el-select v-model='formData.isForce'>
                    <el-option v-for='item in forceUpdate' :key='item.value' :label='item.label' :value='item.value'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='下载地址：'>
                <el-input v-model='formData.url'></el-input>
            </el-form-item>
            <el-form-item label='更新说明：'>
                <el-input v-model='formData.updateMessage' type='textarea' :autosize="{minRows:3}"></el-input>
            </el-form-item>
        </el-form>
        <div slot='footer'>
            <el-button :size='$size' @click='open=false'>取消</el-button>
            <el-button :size='$size' type='primary' @click='add' :loading="btnLoading">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { updateTypes } from "./../../util/publicParams.js";
export default {
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        show: {
            type: Boolean,
            default: false
        },
        version: {
            type: Object
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
                this.maxV1 = "";
                this.maxV2 = "";
                this.maxV3 = "";
                this.minV1 = "";
                this.minV2 = "";
                this.minV3 = "";
            }
        },
        item(val) {
            let obj = JSON.parse(JSON.stringify(val));
            this.formData = {
                ...obj,
                defVersion: this.version.version
            };
            let max = obj.maxVersion;
            this.changeVersion("max", max);
            let min = obj.minVersion;
            this.changeVersion("min", min);
            this.ifIos();
        }
    },
    data() {
        let that = this;
        return {
            forceUpdate: [
                // { label: "请选择", value: "" },
                { label: "是", value: 1 },
                { label: "否", value: 0 }
            ],
            updateTypes,
            open: this.show,
            btnLoading: false,
            maxV1: "",
            maxV2: "",
            maxV3: "",
            minV1: "",
            minV2: "",
            minV3: "",
            formData: {
                defVersion: that.version.version,
                url: ""
            }
        };
    },
    computed: {
        versionList() {
            if (this.$attrs.versionList) {
                return this.$attrs.versionList;
            } else {
                return [];
            }
        },
        newUpdateType() {
            return this.updateTypes.filter(item => item.value);
        },
        newVersionList() {
            let arr = [];
            this.versionList.forEach(item => {
                arr.push([item.maxVersion, item.minVersion]);
            });
            return arr;
        },
        maxV() {
            if (!this.maxV1 || !this.maxV2 || !this.maxV3) {
                return "";
            }
            return `${this.maxV1}.${this.maxV2}.${this.maxV3}`;
        },
        minV() {
            if (!this.minV1 || !this.minV2 || !this.minV3) {
                return "";
            }
            return `${this.minV1}.${this.minV2}.${this.minV3}`;
        },
        compareMax() {
            if (this.maxV) {
                return this.versionToNum(this.maxV);
            } else {
                return "";
            }
        },
        compareMin() {
            if (this.minV) {
                return this.versionToNum(this.minV);
            } else {
                return "";
            }
        },
        defV() {
            let arr = (this.version.version + "").split("");
            let l = arr.length;
            if (l == 5) {
                let v1 = arr[0] - 0 + "";
                let v2 = `${arr[1]}${arr[2]}` - 0;
                let v3 = `${arr[3]}${arr[4]}` - 0;
                return `${v1}.${v2}.${v3}`;
            }
            if (l == 6) {
                let v1 = `${arr[0]}${arr[1]}` - 0;
                let v2 = `${arr[2]}${arr[3]}` - 0;
                let v3 = `${arr[4]}${arr[5]}` - 0;
                return `${v1}.${v2}.${v3}`;
            }
        },
        compareList() {
            let max = this.compareMax;
            let min = this.compareMin;
            let list = this.newVersionList;
            let length = list.length;
            let result = true;
            let modify = this.item;
            if (Object.keys(modify).length > 0) {
                let arr = [modify.maxVersion, modify.minVersion];
                let newList = [];
                for (let i = 0; i < length; i++) {
                    console.log("TCL: compareList -> list[i]", list[i]);
                    if (!(list[i][0] == arr[0] && list[i][1] == arr[1])) {
                        newList.push(list[i]);
                    }
                }
                list = newList;
            }
            length = list.length;
            if (max && min && length) {
                for (let i = 0; i < length; i++) {
                    let one = list[i];
                    let oneMax = one[0];
                    let oneMin = one[1];
                    if (max > oneMin && min < oneMin) {
                        result = false;
                    }
                    if (max > oneMax && min < oneMax) {
                        result = false;
                    }
                    if (max <= oneMax && min >= oneMin) {
                        result = false;
                    }
                }
            }
            return result;
        }
    },
    methods: {
        // 给ios增加默认的url
        ifIos() {
            if (this.$route.query.os == "ios") {
                this.$set(
                    this.formData,
                    "url",
                    "https://itunes.apple.com/app/id1450939688"
                );
            }
        },
        versionToNum(version) {
            let arr = version.split(".");
            let str = "";
            for (let i in arr) {
                let num = arr[i] - 0;
                if (num < 10) {
                    str += "0" + num;
                } else {
                    str += num;
                }
            }
            return str;
        },
        changeVersion(type, version) {
            let arr = (version + "").split("");
            let l = arr.length;
            if (l == 5) {
                this[`${type}V1`] = arr[0] - 0 + "";
                this[`${type}V2`] = `${arr[1]}${arr[2]}` - 0 + "";
                this[`${type}V3`] = `${arr[3]}${arr[4]}` - 0 + "";
            }
            if (l == 6) {
                this[`${type}V1`] = `${arr[0]}${arr[1]}` - 0 + "";
                this[`${type}V2`] = `${arr[2]}${arr[3]}` - 0 + "";
                this[`${type}V3`] = `${arr[4]}${arr[5]}` - 0 + "";
            }
        },
        checkLength(position, e) {
            let base = 0;
            if (position.startsWith("min")) {
                base = 3;
            }
            let last = position.charAt(position.length - 1);
            let next = `v${last - 0 + base + 1}`;
            if (e < 0) {
                this[position] = 0 - e;
            }
            if (e.length == 2) {
                if (last - 0 + base < 6) {
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
        gtZero(type, e) {
            let xxx = null;
            if (e < 0) {
                // this.formData[type] = 0 - e;
                xxx = 0 - e;
            } else {
                xxx = e;
            }
            if (xxx > 0) {
                this.$nextTick(() => {
                    this.formData[type] = Math.round(xxx - 0);
                });
            }
        },
        // 验证更新的下载地址
        checkUrl() {
            if (this.$route.query.os == "android") {
                let { updateType, url } = this.formData;
                if (updateType == "all") {
                    if (url.indexOf(".apk") == -1) {
                        this.$message.error("全量更新下载地址Url错误");
                        this.btnLoading = false;
                        return false;
                    }
                } else if (updateType == "part") {
                    if (!url.indexOf(".patch") == -1) {
                        this.$message.error("增量更新下载地址Url错误");
                        this.btnLoading = false;
                        return false;
                    }
                }
                return true;
            } else {
                return true;
            }
        },
        check(obj, arr) {
            console.log("TCL: check -> obj", obj);
            if (Object.keys(obj).length == 0) {
                this.$message.warning("提交信息不能为空");
                return;
            }
            for (let i = 0, l = arr.length; i < l; i++) {
                if (!obj[arr[i]]) {
                    if (obj[arr[i]] !== 0) {
                        this.$message.warning("请补全信息");
                        return false;
                    }
                }
            }
            return true;
        },
        // 比较最大最小版本号
        compareVersion() {
            if (this.compareMax && this.compareMin) {
                if (this.compareMax > this.compareMin) {
                    return true;
                }
            }
            this.$message.error("最大版本号应大于最小版本号");
            this.btnLoading = false;
            return false;
        },
        add() {
            this.btnLoading = true;
            let api = this.$api.platformSubVersionAdd;
            let successMessage = "新增成功";
            let errorMessage = "新增失败";
            if (Object.keys(this.item).length > 0) {
                api = this.$api.platformSubVersionUpdate;
                successMessage = "修改成功";
                errorMessage = "修改失败";
            }
            if (!this.compareVersion()) return;
            if (!this.checkUrl()) return;
            let data = {
                ...this.formData,
                defId: this.version.id,
                maxVersion: this.maxV,
                minVersion: this.minV,
                defVersion: this.defV
            };
            if (
                !this.check(data, [
                    "appSize",
                    "isForce",
                    "maxVersion",
                    "minVersion",
                    "updateMessage",
                    "updateType",
                    "url"
                ])
            ) {
                this.btnLoading = false;
                return;
            }
            if (!this.compareList) {
                this.$message.error(
                    "最大最小版本和现有版本号冲突(存在包含关系),请检查"
                );
                this.btnLoading = false;
                return;
            }
            this.$http
                .post(api, data, true)
                .then(res => {
                    this.btnLoading = false;
                    this.$notify({
                        title: "成功",
                        message: successMessage,
                        type: "success"
                    });
                    this.$emit("success");
                    this.open = false;
                })
                .catch(err => {
                    this.btnLoading = false;
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