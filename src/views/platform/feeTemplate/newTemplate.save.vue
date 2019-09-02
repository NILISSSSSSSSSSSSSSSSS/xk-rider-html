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
                    <label>模板名称 :</label>
                    <el-input class="rider-input input-350" :size='$size' placeholder='请输入模板名称' v-model='formData.tempName'></el-input>
                </div>
                <h1 class="title">外卖类运费设置</h1>
                <out-setting :form.sync='outForm'></out-setting>
                <h1 class="title">自营商品类运费设置</h1>
                <self-setting :form.sync='selfForm'></self-setting>

            </el-form>
        </div>
        <div class="rider-form" style='padding-top:0'>
            <!-- 当模版为全国模版的时候隐藏区域相关功能 -->
            <div class="line-space-between" v-if='!$route.query.whole'>
                <h1 class="title">使用区域</h1>
                <el-button :size='$size' type='primary' class="rider-btn" @click='openAddArea=true'>添加</el-button>
            </div>
        </div>
        <div class="rider-table" v-if='!$route.query.whole'>
            <el-table fit :data='tableData2' :size='$size'>
                <el-table-column label='省' prop='provinceCode' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.provinceCode|getProvinceName}}
                    </template>
                </el-table-column>
                <el-table-column label='市' prop='cityCode' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.cityCode|getCityName}}
                    </template>
                </el-table-column>
                <el-table-column label='区' prop='districtCode' min-width='120'>
                    <template slot-scope='scope'>
                        {{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                <el-table-column label='操作' min-width='120'>
                    <template slot-scope='scope'>
                        <el-button type='danger' :size='$size' @click='removeArea(scope.row)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :total='total' :form='areaPageInfo' @page="getPage" v-if='!$route.query.whole'></Pagination>
        <template-add-area :data.sync='areaTableData'></template-add-area>
        <div class="btn-group">
            <el-button type='primary' @click="submit()" :loading="loading">保存</el-button>
            <el-button @click='$router.replace({name:"transTemplate"})' :loading="loading">取消</el-button>
        </div>
        <el-dialog :visible.sync="openAddArea" width='400px' title="添加区域">
            <el-form>
                <el-form-item label='配送区域:'>
                    <province-cascader v-model='areaArr'></province-cascader>
                </el-form-item>
            </el-form>
            <div class="footer" slot='footer'>
                <el-button :size='$size' @click='closeAddArea()'>取消</el-button>
                <el-button :size='$size' type='primary' @click='addArea()' :disabled="!areaArr.length">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import OutSetting from "./../../../components/platform/OutSetting";
import SelfSetting from "./../../../components/platform/SelfSetting";
import ProvinceCascader from "./../../../components/ProvinceCascader";
import TemplateAddArea from "./../../../components/platform/TemplateAddArea";
import { canUse } from "./../../../menu/permission.js";
import moment from "moment";
export default {
    components: { OutSetting, SelfSetting, ProvinceCascader, TemplateAddArea },
    data() {
        return {
            modify: this.$route.query.modify || null,
            openAddArea: false,
            transArea: [],
            productType: [],
            total: 0,
            areaArr: [],
            areaTableData: [],
            areaPageInfo: { page: 1, limit: 10 },
            formData: {
                tempName: ""
            },
            outForm: {
                orderType: "food",
                price: "",
                distances: [{}],
                discountDefine: { isOpen: "1", discountRules: [{}] },
                extraDefine: { isOpen: "1", extras: [{}] }
            },
            selfForm: {
                orderType: "not_food",
                price: "",
                distances: [{}],
                weights: [{}],
                discountDefine: { isOpen: "1", discountRules: [{}] },
                extraDefine: { isOpen: "1", extras: [{}] }
            },
            loading: false
        };
    },
    created() {
        this.getDetail();
        if (!this.$route.query.modify) {
            canUse("templateNew");
        }
    },
    computed: {
        mFormData() {
            return {
                ...this.formData,
                regions: this.areaTableData
            };
        },
        areaToObj() {
            let [provinceCode, cityCode, districtCode] = this.areaArr;
            return {
                provinceCode,
                cityCode,
                districtCode
            };
        },
        tableData2() {
            let table = JSON.parse(JSON.stringify(this.areaTableData));
            let page = this.areaPageInfo.page;
            let limit = this.areaPageInfo.limit;
            let tablePage = table.splice((page - 1) * limit, limit);
            return tablePage;
        }
    },
    watch: {
        // 监听地址数量,自动滚动到底
        total() {
            let bottom = document.querySelector(".btn-group");
            bottom.scrollIntoView({ block: "end", behavior: "smooth" });
        }
    },
    methods: {
        // 获取详情
        getDetail() {
            if (this.$route.query.modify) {
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
            this.outForm = outChange;
            this.selfForm = selfChange;
        },
        formatDetailForm(form) {
            if (!form) return;
            let f = JSON.parse(JSON.stringify(form));
            let type = "";
            for (let key in f) {
                let arr = [];
                if (key == "price") {
                    f[key] = f[key] / 100 + "";
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
                    console.log("​formatDetailForm -> arr", arr);
                    f[key].isOpen = f[key].isOpen + "";
                } else if (key == "weights") {
                    arr = f[key] || [];
                }
                console.log("getin", key, arr);
                let l = arr.length;
                if (arr && l > 0) {
                    for (let i = 0; i < l; i++) {
                        if (arr[i].startAt && arr[i].endAt) {
                            arr[i].startAt = moment.unix(arr[i].startAt)._d;
                            arr[i].endAt = moment.unix(arr[i].endAt)._d;
                        }

                        if (arr[i].price >= 0) {
                            arr[i].price = arr[i].price / 100;
                        }

                        if (arr[i].addPrice >= 0) {
                            arr[i].addPrice = arr[i].addPrice / 100;
                        }

                        if (arr[i].ratio >= 0) {
                            arr[i].ratio = Number(arr[i].ratio) * 100;
                        }

                        if (
                            arr[i].startDistance >= 0 &&
                            arr[i].endDistance >= 0
                        ) {
                            arr[i].startDistance = arr[i].startDistance / 1000;
                            arr[i].endDistance = arr[i].endDistance / 1000;
                        }
                        // if (arr[i]["distances-price"]) {
                        //     arr[i]["distances-price"] =
                        //         arr[i]["distances-price"] / 100;
                        // }
                    }
                }
            }
            console.log("​formatDetailForm -> f", f);

            return f;
        },
        // 处理提交数据单位
        formatForm(form) {
            if (!form) return;
            let f = JSON.parse(JSON.stringify(form));
            let type = "";
            for (let key in f) {
                let arr = [];
                if (key == "price") {
                    f[key] = f[key] * 100;
                } else if (key == "orderType") {
                    type = f[key];
                } else if (key == "distances") {
                    arr = f[key];
                } else if (key == "discountDefine") {
                    arr = f[key].discountRules;
                } else if (key == "extraDefine") {
                    arr = f[key].extras;
                } else if (key == "weights") {
                    arr = f[key] || [];
                }
                console.log("sendsend", key, arr);
                let l = arr.length;
                if (arr && l > 0) {
                    for (let i = 0; i < l; i++) {
                        if (arr[i].startAt && arr[i].endAt) {
                            arr[i].startAt =
                                moment(arr[i].startAt).format("X") - 0;
                            arr[i].endAt = moment(arr[i].endAt).format("X") - 0;
                        }

                        if (arr[i].price >= 0) {
                            arr[i].price = arr[i].price * 100;
                        }

                        if (arr[i].addPrice > 0) {
                            arr[i].addPrice = arr[i].addPrice * 100;
                        }

                        if (arr[i].ratio >= 0) {
                            arr[i].ratio = Number(arr[i].ratio) / 100;
                        }

                        if (
                            arr[i].startDistance >= 0 &&
                            arr[i].endDistance >= 0
                        ) {
                            arr[i].startDistance = arr[i].startDistance * 1000;
                            arr[i].endDistance = arr[i].endDistance * 1000;
                        }
                        // if (arr[i]["distances-price"]) {
                        //     arr[i]["distances-price"] =
                        //         arr[i]["distances-price"] * 100;
                        // }
                    }
                }
            }
            // 处理最后一项

            // distance_last中值处理之后变成Number类型,判断的时候注意转换类型
            let distance_last = f.distances[f.distances.length - 1];
            if (
                !(
                    distance_last.endDistance + "" &&
                    distance_last.startDistance + "" &&
                    distance_last.price + ""
                )
            ) {
                f.distances.pop();
            }
            if (type == "not_food") {
                let weights_last = f.weights[f.weights.length - 1];
                if (
                    !(
                        weights_last.startWeight + "" &&
                        weights_last.endWeight + "" &&
                        weights_last.addPrice + ""
                    )
                ) {
                    f.weights.pop();
                }
            }

            let extra_last =
                f.extraDefine.extras[f.extraDefine.extras.length - 1];
            if (
                !(
                    extra_last.startAt &&
                    extra_last.endAt &&
                    extra_last.price + ""
                )
            ) {
                f.extraDefine.extras.pop();
            }
            let discount_last =
                f.discountDefine.discountRules[
                    f.discountDefine.discountRules.length - 1
                ];
            if (
                !(
                    (discount_last.endDistance + "" &&
                        discount_last.startDistance + "" &&
                        discount_last.ratio + "") ||
                    (discount_last.startAt &&
                        discount_last.endAt &&
                        discount_last.ratio + "")
                )
            ) {
                f.discountDefine.discountRules.pop();
            }
            return f;
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
                    if (
                        key == "price" &&
                        !(form1.price != undefined && form1.price + "")
                    ) {
                        this.$message.info(`请补全${type}的起送费`);
                        return true;
                    } else if (key == "distances") {
                        let x = this.checkDistance(form1.distances, type);
                        if (x) return true;
                    } else if (key == "weights") {
                        let x = this.checkWeight(form1.weights, type);
                        if (x) return true;
                    } else if (key == "discountDefine") {
                        let x = this.checkDiscount(form1.discountDefine, type);
                        if (x) return true;
                    } else if (key == "extraDefine") {
                        let x = this.checkExtra(form1.extraDefine, type);
                        if (x) return true;
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
                        return true;
                    }
                } else {
                    if (i == 0) {
                        this.$message.info(
                            `请补全${type}距离设置的第${i + 1}项`
                        );
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
                        return true;
                    }
                } else {
                    if (i == 0) {
                        this.$message.info(
                            `请补全${type}重量设置的第${i + 1}项`
                        );
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
                            return true;
                        }
                    } else {
                        if (i == 0) {
                            this.$message.info(
                                `请补全${type}折扣设置的第${i + 1}项`
                            );
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
                            return true;
                        }
                    } else {
                        if (i == 0) {
                            this.$message.info(
                                `请补全${type}附加设置的第${i + 1}项`
                            );
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        closeAddArea() {
            this.areaArr = [];
            this.openAddArea = false;
        },
        // 添加适用区域
        addArea() {
            var all = JSON.stringify(this.areaTableData);
            var one = JSON.stringify(this.areaToObj);
            var index = all.indexOf(one);
            if (index !== -1) {
                this.$message.warning("请不要重复添加");
                return;
            }
            this.areaTableData.push(this.areaToObj);
            this.total = this.areaTableData.length;
            this.areaArr = [];
            this.openAddArea = false;
        },
        // 本地分页删除区域
        removeArea(item) {
            var all = JSON.stringify(this.areaTableData);
            var one = JSON.stringify(item);
            var index = all.indexOf(one);
            if (index !== -1) {
                let reAll = all.replace(one, "{}");
                let parseAll = JSON.parse(reAll);
                for (let i = 0, l = parseAll.length; i < l; i++) {
                    if (JSON.stringify(parseAll[i]) == "{}") {
                        parseAll.splice(i, 1);
                    }
                }
                this.areaTableData = parseAll;
                this.total = parseAll.length;
                if (this.total % 10 === 0) {
                    this.areaPageInfo.page--;
                }
            }
        },
        // 本地分页
        getPage(val) {
            this.areaPageInfo = { limit: val.limit, page: val.page };
            if (this.areaTableData.length < 10) {
                this.areaPageInfo = {
                    limit: 10,
                    page: 1
                };
            }
        },
        submit() {
            let api = this.$api.platformTemplateCreate;
            if (this.$route.query.modify && this.$route.query.id) {
                if (!canUse("templateUpdate")) return;
            } else {
                if (!canUse("templateNew")) return;
            }
            let x = true;
            let xx = true;
            let xxx = true;
            if (!this.mFormData.tempName) {
                this.$message.info("请输入模版名称");
                // const h = this.$createElement;
                // this.$message({
                //     message: h("p", null, [
                //         h("span", null, "内容可以是 "),
                //         h("strong", null, "VNode")
                //     ])
                // });
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
                xx = false;
            }
            xxx = this.checkForm(this.outForm, this.selfForm);
            console.warn(x || xx || xxx);
            // x 模版名 xx 适用区域 xxx 表单验证
            if (x || xx || xxx) return;
            this.loading = true;
            let fOut = this.formatForm(this.outForm);
            console.log(
                "%c   ",
                "background:lightblue",
                ": submit -> fOut",
                fOut
            );
            let fSelf = this.formatForm(this.selfForm);
            console.log(
                "%c   ",
                "background:lightblue",
                ": submit -> fSelf",
                fSelf
            );
            let data = {
                carriageDefine: {
                    ...this.mFormData,
                    examineDefines: [fOut, fSelf]
                }
            };
            console.log("​submit -> data", data);
            if (this.$route.query.modify && this.$route.query.id) {
                api = this.$api.platformTemplateUpdate;
                data.carriageDefine.tempId = this.$route.query.id;
            }
            console.log("提交", data);
            // return;
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