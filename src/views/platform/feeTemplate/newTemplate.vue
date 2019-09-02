<template>
    <div class="new-template rider-container">
        <div class="rider-switch">
            <div class="tab active">
                {{this.$route.query.modify?"修改运费模版":"新增运费模版"}}
            </div>
        </div>
        <div class="rider-form">
            <el-form label-width="100px">
                <div class='line-flex-start' style='border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:25px;'>
                    <label>模板名称: </label>
                    <el-input class="rider-input input-350" :size='$size' placeholder='请输入模板名称' v-model='formData.tempName'></el-input>
                </div>
                <h1 class="title">外卖类运费设置</h1>
                <out-setting ref='out'></out-setting>
                <h1 class="title">商品类运费设置</h1>
                <self-setting ref='self'></self-setting>
            </el-form>
        </div>
        <template-add-area :data.sync='areaTableData'></template-add-area>
        <div class="btn-group">
            <el-button type='primary' @click="submit()" :loading="loading">保存</el-button>
            <el-button @click='$router.replace({name:"transTemplate"})' :loading="loading">取消</el-button>
        </div>
    </div>
</template>
<script>
import OutSetting from "./../../../components/platform/OutSetting";
import SelfSetting from "./../../../components/platform/SelfSetting";
import TemplateAddArea from "./../../../components/platform/TemplateAddArea";
import { canUse } from "./../../../menu/permission.js";
import moment from "moment";
import { mapMutations } from "vuex";
import {
    format100To1,
    format1To100,
    format1000To1
} from "./../../../util/filterMethods";
export default {
    components: { OutSetting, SelfSetting, TemplateAddArea },
    data() {
        return {
            modify: this.$route.query.modify || null,
            transArea: [],
            productType: [],
            areaTableData: [],
            formData: {
                tempName: ""
            },
            // outForm: {
            //     orderType: "food",
            //     price: "",
            //     distances: [{}],
            //     discountDefine: { isOpen: "1", discountRules: [{}] },
            //     extraDefine: { isOpen: "1", extras: [{}] }
            // },
            // selfForm: {
            //     orderType: "not_food",
            //     price: "",
            //     distances: [{}],
            //     weights: [{}],
            //     discountDefine: { isOpen: "1", discountRules: [{}] },
            //     extraDefine: { isOpen: "1", extras: [{}] }
            // },
            loading: false,
            formLoading: null
        };
    },
    created() {
        this.getDetail();
        if (!this.$route.query.modify) {
            canUse("templateNew");
        }
    },
    destroyed() {
        this.resetTemplate();
    },
    computed: {
        getQuery() {
            return this.$route.query;
        },
        mFormData() {
            return {
                ...this.formData,
                regions: this.areaTableData
            };
        },
        outForm() {
            return this.$store.state.template.out;
        },
        selfForm() {
            return this.$store.state.template.self;
        }
    },
    watch: {
        getQuery(newV, oldV) {
            if (oldV != newV) {
                location.reload();
            }
        }
    },
    methods: {
        ...mapMutations({
            saveTemplate: "template/saveTemplate",
            resetTemplate: "template/resetTemplate"
        }),
        showLoading() {
            this.formLoading = this.$loading({
                lock: true,
                text: "获取中",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
                target: document.querySelector(".new-template")
            });
        },
        closeLoading() {
            setTimeout(() => {
                this.formLoading.close();
            }, 1000);
        },
        // 获取详情
        getDetail() {
            if (this.$route.query.modify) {
                this.showLoading();
                this.$http
                    .get(
                        this.$api.platformTemplateDetail,
                        { tempId: this.$route.query.id },
                        true
                    )
                    .then(res => {
                        console.log("​getDetail -> res", res);
                        this.formatDetail(res);
                    })
                    .catch(err => {
                        console.log("​getDetail -> err", err);
                        this.$message.error("获取详情失败 错误码:" + err.code);
                        this.closeLoading();
                    });
            }
        },
        // 处理获取到的详情单位
        formatDetail(form) {
            let { examineDefines, regions } = form;
            this.areaTableData = regions;
            this.formData.tempName = form.tempName;
            this.total = regions.length;
            let out = {};
            let self = {};
            let type1 = examineDefines[0].orderType;
            if (type1 == "food") {
                out = examineDefines[0];
                self = examineDefines[1];
            } else {
                out = examineDefines[1];
                self = examineDefines[0];
            }
            let outChange = this.formatDetailForm(out);
            let selfChange = this.formatDetailForm(self);
            // this.outForm = outChange;
            // this.selfForm = selfChange;
            this.saveTemplate({ key: "out", form: outChange });
            this.saveTemplate({ key: "self", form: selfChange });
            this.closeLoading();
        },
        formatDetailForm(form) {
            if (!form) return;
            let f = JSON.parse(JSON.stringify(form));
            let type = "";
            for (let key in f) {
                let arr = [];
                if (key == "price") {
                    f[key] = format100To1(f[key]) + "";
                } else if (key == "subsidyRatio") {
                    f[key] = format1To100(Number(f[key]));
                } else if (key == "drawOutRatio") {
                    f[key] = format1To100(Number(f[key]));
                } else if (key == "orderType") {
                    type = f[key];
                } else if (key == "distances") {
                    arr = f[key];
                } else if (key == "discountDefine") {
                    arr =
                        f[key].discountRules.length > 0
                            ? f[key].discountRules
                            : f[key].discountRules.push({});
                    f[key].isOpen = f[key].isOpen + "";
                } else if (key == "extraDefine") {
                    arr =
                        f[key].extras.length > 0
                            ? f[key].extras
                            : f[key].extras.push({});
                    f[key].isOpen = f[key].isOpen + "";
                } else if (key == "weights") {
                    arr = f[key] || [];
                }
                let l = arr.length;
                if (arr && l > 0) {
                    // 转换单位
                    for (let i = 0; i < l; i++) {
                        if (arr[i].startAt && arr[i].endAt) {
                            arr[i].startAt = moment.unix(arr[i].startAt)._d;
                            arr[i].endAt = moment.unix(arr[i].endAt)._d;
                        }
                        if (arr[i].price >= 0) {
                            // arr[i].price = arr[i].price / 100;
                            arr[i].price = format100To1(arr[i].price);
                        }
                        if (arr[i].addPrice >= 0) {
                            // arr[i].addPrice = arr[i].addPrice / 100;
                            arr[i].addPrice = format100To1(arr[i].addPrice);
                        }
                        if (arr[i].ratio >= 0) {
                            // arr[i].ratio = Number(arr[i].ratio) * 100;
                            arr[i].ratio = format1To100(Number(arr[i].ratio));
                        }
                        if (
                            arr[i].startDistance >= 0 &&
                            arr[i].endDistance >= 0
                        ) {
                            // arr[i].startDistance = arr[i].startDistance / 1000;
                            // arr[i].endDistance = arr[i].endDistance / 1000;
                            arr[i].startDistance = format1000To1(
                                arr[i].startDistance
                            );
                            arr[i].endDistance = format1000To1(
                                arr[i].endDistance
                            );
                        }
                        // if (arr[i]["distances-price"]) {
                        //     arr[i]["distances-price"] =
                        //         arr[i]["distances-price"] / 100;
                        // }
                    }
                }
            }
            return f;
        },
        // 处理提交数据单位
        // formatForm(form) {
        //     if (!form) return;
        //     let f = JSON.parse(JSON.stringify(form));
        //     let type = "";
        //     for (let key in f) {
        //         let arr = [];
        //         if (key == "price") {
        //             f[key] = f[key] * 100;
        //         } else if (key == "orderType") {
        //             type = f[key];
        //         } else if (key == "distances") {
        //             arr = f[key];
        //         } else if (key == "discountDefine") {
        //             arr = f[key].discountRules;
        //         } else if (key == "extraDefine") {
        //             arr = f[key].extras;
        //         } else if (key == "weights") {
        //             arr = f[key] || [];
        //         }
        //         let l = arr.length;
        //         if (arr && l > 0) {
        //             for (let i = 0; i < l; i++) {
        //                 if (arr[i].startAt && arr[i].endAt) {
        //                     arr[i].startAt =
        //                         moment(arr[i].startAt).format("X") - 0;
        //                     arr[i].endAt = moment(arr[i].endAt).format("X") - 0;
        //                 }
        //                 if (arr[i].price >= 0) {
        //                     arr[i].price = arr[i].price * 100;
        //                 }
        //                 if (arr[i].addPrice >= 0) {
        //                     arr[i].addPrice = arr[i].addPrice * 100;
        //                 }
        //                 if (arr[i].ratio >= 0) {
        //                     arr[i].ratio = Number(arr[i].ratio) / 100;
        //                 }
        //                 if (
        //                     arr[i].startDistance >= 0 &&
        //                     arr[i].endDistance >= 0
        //                 ) {
        //                     arr[i].startDistance = arr[i].startDistance * 1000;
        //                     arr[i].endDistance = arr[i].endDistance * 1000;
        //                 }
        //                 // if (arr[i]["distances-price"]) {
        //                 //     arr[i]["distances-price"] =
        //                 //         arr[i]["distances-price"] * 100;
        //                 // }
        //             }
        //         }
        //     }
        //     // 处理最后一项
        //     // distance_last中值处理之后变成Number类型,判断的时候注意转换类型
        //     let distance_last = f.distances[f.distances.length - 1];
        //     if (
        //         !(
        //             distance_last.endDistance >= 0 &&
        //             distance_last.startDistance >= 0 &&
        //             distance_last.price >= 0
        //         )
        //     ) {
        //         f.distances.pop();
        //     }
        //     if (type == "not_food") {
        //         let weights_last = f.weights[f.weights.length - 1];
        //         if (
        //             !(
        //                 weights_last.startWeight >= 0 &&
        //                 weights_last.endWeight >= 0 &&
        //                 weights_last.addPrice >= 0
        //             )
        //         ) {
        //             f.weights.pop();
        //         }
        //     }

        //     let extra_last =
        //         f.extraDefine.extras[f.extraDefine.extras.length - 1];
        //     if (
        //         !(
        //             extra_last.startAt &&
        //             extra_last.endAt &&
        //             extra_last.price >= 0
        //         )
        //     ) {
        //         f.extraDefine.extras.pop();
        //     }
        //     let discount_last =
        //         f.discountDefine.discountRules[
        //             f.discountDefine.discountRules.length - 1
        //         ];
        //     if (
        //         !(
        //             (discount_last.endDistance >= 0 &&
        //                 discount_last.startDistance >= 0 &&
        //                 discount_last.ratio >= 0) ||
        //             (discount_last.startAt &&
        //                 discount_last.endAt &&
        //                 discount_last.ratio >= 0)
        //         )
        //     ) {
        //         f.discountDefine.discountRules.pop();
        //     }
        //     return f;
        // },
        // 滚动到未填写正确的项
        scroll(type, itemName, line) {
            if (type == "外卖类") {
                this.$refs.out.scroll(itemName, line);
                return;
            }
            if (type == "自营类") {
                this.$refs.self.scroll(itemName, line);
                return;
            }
        },
        // 验证表单是否完全
        checkForm(form1, form2) {
            let type = "";
            if (form1.orderType == "food") {
                type = "外卖类";
            } else if (form1.orderType == "not_food") {
                type = "自营类";
            }
            for (let key in form1) {
                if (form1.hasOwnProperty(key)) {
                    console.log("TCL: checkForm -> key", type, key);
                    if (
                        key == "price" &&
                        !(form1.price != undefined && form1.price + "")
                    ) {
                        //起送费
                        this.$message.info(`请补全${type}的起送费`);
                        this.scroll(type, "start");
                        return true;
                    } else if (
                        key == "drawOutRatio" &&
                        !(
                            form1.drawOutRatio != undefined &&
                            form1.drawOutRatio + ""
                        )
                    ) {
                        //抽成
                        this.$message.info(`请补全${type}的抽成比例`);
                        this.scroll(type, "take");
                        return true;
                    } else if (
                        key == "subsidyRatio" &&
                        !(
                            form1.subsidyRatio != undefined &&
                            form1.subsidyRatio + ""
                        )
                    ) {
                        //补贴
                        this.$message.info(`请补全${type}的补贴比例`);
                        this.scroll(type, "subsidy");
                        return true;
                    } else if (key == "distances") {
                        //距离
                        let x = this.checkDistance(form1.distances, type);
                        if (x) {
                            // this.scroll(type, "distance");
                            return true;
                        }
                    } else if (key == "weights") {
                        //重量
                        let x = this.checkWeight(form1.weights, type);
                        if (x) {
                            // this.scroll(type, "weight");
                            return true;
                        }
                    } else if (key == "discountDefine") {
                        //折扣
                        let x = this.checkDiscount(form1.discountDefine, type);
                        if (x) {
                            // this.scroll(type, "discount");
                            return true;
                        }
                    } else if (key == "extraDefine") {
                        //附加
                        let x = this.checkExtra(form1.extraDefine, type);
                        if (x) {
                            // this.scroll(type, "extra");
                            return true;
                        }
                    }
                }
            }
            if (form2) {
                return this.checkForm(form2);
            }
            return false;
        },
        // 验证距离
        checkDistance(arr, type) {
            for (let i = 0, l = arr.length; i < l; i++) {
                if (Object.keys(arr[i]).length > 0) {
                    let item = arr[i];
                    if (
                        !(
                            item.startDistance + "" &&
                            item.endDistance + "" &&
                            item.price + "" &&
                            item.startDistance != undefined &&
                            item.endDistance != undefined &&
                            item.price != undefined
                        )
                    ) {
                        this.$message.info(
                            `请补全${type}距离设置的第${i + 1}项`
                        );
                        this.scroll(type, "distance", i);
                        return true;
                    }
                } else {
                    if (i == 0) {
                        this.$message.info(
                            `请补全${type}距离设置的第${i + 1}项`
                        );
                        this.scroll(type, "distance", i);
                        return true;
                    }
                }
            }
            return false;
        },
        // 验证重量
        checkWeight(list, type) {
            let arr = list || [];
            for (let i = 0, l = arr.length; i < l; i++) {
                if (Object.keys(arr[i]).length > 0) {
                    let item = arr[i];
                    if (
                        !(
                            item.startWeight + "" &&
                            item.endWeight + "" &&
                            item.addPrice + "" &&
                            item.startWeight != undefined &&
                            item.endWeight != undefined &&
                            item.addPrice != undefined
                        )
                    ) {
                        this.$message.info(
                            `请补全${type}重量设置的第${i + 1}项`
                        );
                        this.scroll(type, "weight", i);
                        return true;
                    }
                } else {
                    if (i == 0) {
                        this.$message.info(
                            `请补全${type}重量设置的第${i + 1}项`
                        );
                        this.scroll(type, "weight", i);
                        return true;
                    }
                }
            }
            return false;
        },
        // 验证折扣
        checkDiscount(obj, type) {
            let arr = obj.discountRules;
            if (obj.isOpen - 0) {
                for (let i = 0, l = arr.length; i < l; i++) {
                    if (Object.keys(arr[i]).length > 0) {
                        let item = arr[i];
                        if (
                            !(
                                (item.endAt &&
                                    item.startAt &&
                                    item.ratio != undefined &&
                                    item.ratio + "") ||
                                (item.endDistance + "" &&
                                    item.startDistance + "" &&
                                    item.ratio + "" &&
                                    item.endDistance != undefined &&
                                    item.startDistance != undefined &&
                                    item.ratio != undefined)
                            )
                        ) {
                            this.$message.info(
                                `请补全${type}折扣设置的第${i + 1}项`
                            );
                            this.scroll(type, "discount", i);
                            return true;
                        }
                    } else {
                        if (i == 0) {
                            this.$message.info(
                                `请补全${type}折扣设置的第${i + 1}项`
                            );
                            this.scroll(type, "discount", i);
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        // 验证附加
        checkExtra(obj, type) {
            let arr = obj.extras;
            if (obj.isOpen - 0) {
                for (let i = 0, l = arr.length; i < l; i++) {
                    if (Object.keys(arr[i]).length > 0) {
                        let item = arr[i];
                        if (
                            !(
                                item.endAt &&
                                item.startAt &&
                                item.price != undefined &&
                                item.price + ""
                            )
                        ) {
                            this.$message.info(
                                `请补全${type}附加设置的第${i + 1}项`
                            );
                            this.scroll(type, "extra", i);
                            return true;
                        }
                    } else {
                        if (i == 0) {
                            this.$message.info(
                                `请补全${type}附加设置的第${i + 1}项`
                            );
                            this.scroll(type, "extra", i);
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        //验证区域
        checkArea() {
            for (let item of this.mFormData.regions) {
                if (
                    !(item.cityCode && item.districtCode && item.provinceCode)
                ) {
                    this.$message.info("使用区域请包含省市区");
                    return true;
                }
            }
            return false;
        },
        submit() {
            let api = this.$api.platformTemplateCreate;
            if (this.$route.query.modify && this.$route.query.id) {
                if (!canUse("templateUpdate")) return;
            } else {
                if (!canUse("templateNew")) return;
            }
            // x 模版名 xx 适用区域 xxx 表单验证
            let x = true;
            let xx = true;
            let xxx = true;
            if (!this.mFormData.tempName) {
                this.$message.info("请输入模版名称");
                x = true;
                return;
            } else {
                x = false;
            }
            if (this.mFormData.regions.length == 0) {
                this.$message.info("请选择使用区域");
                xx = true;
                return;
            } else {
                xx = this.checkArea();
            }
            xxx = this.checkForm(this.outForm, this.selfForm);
            console.warn(x || xx || xxx);
            if (x || xx || xxx) return;
            this.loading = true;
            // let fOut = this.formatForm(this.outForm);
            // let fSelf = this.formatForm(this.selfForm);
            let fOut = this.$store.getters["template/formatOut"];
            let fSelf = this.$store.getters["template/formatSelf"];
            let data = {};
            console.log(
                typeof this.$route.query.whole,
                this.$route.query.whole
            );
            // 判断是否是全国模版
            // 如果是,修改地区为000000
            // 如果不是,正常流程
            if (this.$route.query.whole) {
                data = {
                    carriageDefine: {
                        ...{
                            ...this.mFormData,
                            regions: [
                                {
                                    cityCode: "000000",
                                    districtCode: "000000",
                                    provinceCode: "000000"
                                }
                            ]
                        },
                        examineDefines: [fOut, fSelf]
                    }
                };
            } else {
                data = {
                    carriageDefine: {
                        ...this.mFormData,
                        examineDefines: [fOut, fSelf]
                    }
                };
            }
            if (this.$route.query.modify && this.$route.query.id) {
                api = this.$api.platformTemplateUpdate;
                data.carriageDefine.tempId = this.$route.query.id;
            }
            console.log("提交", data);
            this.$http
                .post(api, data, true)
                .then(res => {
                    this.$notify({
                        title: "提示",
                        message: "成功",
                        type: "success"
                    });
                    this.loading = false;
                })
                .catch(err => {
                    this.$notify({
                        title: "提示",
                        message: `失败,${err.message}`,
                        type: "warning"
                    });
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.line-start-start {
    > span {
        line-height: 50px;
    }
    .line-flex-start {
        margin: 0;
    }
}
.btn-group {
    width: 1180px;
    margin: 25px 0;
    text-align: center;
}
.rider-table {
    padding: 0 100px;
    .rider-table-btn-group {
        text-align: right;
    }
}
</style>