<template>
    <div class="template-setting out-setting rider-container" @click='emptyLine=""'>
        <div class="rider-form">
            <!-- 计价方式 -->

            <div class="line-flex-start start-p">
                <label>起送费:</label>
                <div class="line-flex-start" :class="{empty:(`start0`==emptyLine)}">
                    <!-- <el-input class="rider-input input-100" v-model='formData.price' type='number' @input.native='gt0("start",undefined,$event)'
                        :size='$size'></el-input> -->
                    <positive-input class="rider-input input-150" v-model='formData.price' suffix='元'></positive-input>
                    <div class="tips margin-left-20">注：起送费为0km</div>
                </div>
            </div>
            <div class="line-start-start distance-p">
                <label>距离运费:</label>
                <ul>
                    <li class="line-flex-start" :class="{empty:(`distance${index}`==emptyLine)}" v-for='(item,index) in formData.distances'
                        :key='index'>
                        <!-- <el-input class="rider-input input-100" type='number' v-model='item.startDistance' :size='$size'
                            @input.native='gt0("distance",index,$event)'></el-input> -->
                        <positive-input class="rider-input input-150" v-model='item.startDistance' suffix='KM'></positive-input>
                        <span>至</span>
                        <!-- <el-input class="rider-input input-100" type='number' v-model='item.endDistance' :size='$size'
                            @input.native='gt0("distance",index,$event)'></el-input> -->
                        <positive-input class="rider-input input-150" v-model='item.endDistance' suffix='KM'></positive-input>
                        <span>每KM增加 :</span>
                        <!-- <el-input class="rider-input input-100" type='number' v-model='item.price' :size='$size'
                            @input.native='gt0("distance",index,$event)'></el-input> -->
                        <positive-input class="rider-input input-100" v-model='item.price'></positive-input>
                        <span>元</span>
                        <el-button :size='$size' class="rider-btn submit" :disabled="!(item.startDistance>=0&&item.endDistance>=0&&item.price>=0)||index!==formData.distances.length-1"
                            @click='addDistance'>添加</el-button>
                        <el-button :size='$size' class="rider-btn" type='danger' @click='removeDistance(item)'
                            :disabled="formData.distances.length==1">删除</el-button>
                    </li>
                </ul>
            </div>
            <!-- 折扣 -->
            <div class="line-start-start discount-p">
                <label>折扣设置:</label>
                <div>
                    <el-switch class="margin-left-20" v-model='formData.discountDefine.isOpen' active-value="1"
                        inactive-value="0" active-text="开通" inactive-text="关闭"></el-switch>
                    <el-form v-show='formData.discountDefine.isOpen-0'>
                        <ul class=" margin-top-20">
                            <li class="line-flex-start" :class="{empty:(`discount${index}`==emptyLine)}" v-for='(item,index) in formData.discountDefine.discountRules'
                                :key='index'>
                                <el-time-picker class="rider-input input-150" :size='$size' placeholder="起始时间" v-model="item.startAt"
                                    :picker-options="{selectableRange:'00:00:00 - 23:59:59'}">
                                </el-time-picker>
                                <span>至</span>
                                <el-time-picker placeholder="结束时间" class="rider-input input-150" :size='$size' v-model="item.endAt"
                                    :picker-options="{selectableRange:'00:00:00 - 23:59:59'}">
                                </el-time-picker>
                                <span>&nbsp;&nbsp;折 扣 比 :&nbsp;&nbsp;</span>
                                <!-- <el-input class="rider-input input-100" type='number' v-model='item.ratio' :size='$size'
                                    @input.native='gt0("discount",index,$event)'></el-input> -->
                                <positive-input class="rider-input input-100" :max='100' v-model='item.ratio'></positive-input>
                                <span>%</span>
                                <el-button :size='$size' class="rider-btn submit" @click='addDis' :disabled="!(item.startAt&&item.endAt&&item.ratio>=0)||index!==formData.discountDefine.discountRules.length-1">添加</el-button>
                                <el-button :size='$size' class="rider-btn" type='danger' @click='removeDis(item)'
                                    :disabled="formData.discountDefine.discountRules.length==1">删除</el-button>
                            </li>
                        </ul>
                    </el-form>

                </div>
            </div>
            <!-- 附加 -->
            <div class="line-start-start extra-p">
                <label>附加费:</label>
                <div>
                    <el-switch class="margin-left-20" v-model='formData.extraDefine.isOpen' active-value="1"
                        inactive-value="0" active-text="开通" inactive-text="关闭"></el-switch>
                    <el-form v-show='formData.extraDefine.isOpen-0'>
                        <ul>
                            <li class="line-flex-start" :class="{empty:(`extra${index}`==emptyLine)}" v-for='(item,index) in formData.extraDefine.extras'
                                :key='index'>
                                <el-time-picker class="rider-input input-150" :size='$size' placeholder="起始时间" v-model="item.startAt"
                                    :picker-options="{selectableRange:'00:00:00 - 23:59:59'}">
                                </el-time-picker>
                                <span>至</span>
                                <el-time-picker placeholder="结束时间" class="rider-input input-150" :size='$size' v-model="item.endAt"
                                    :picker-options="{selectableRange:'00:00:00 - 23:59:59'}">
                                </el-time-picker>
                                <span>增加配送费</span>
                                <!-- <el-input class="rider-input input-100" type='number' v-model="item.price" :size='$size'
                                    @input.native='gt0("extra",index,$event)'></el-input> -->
                                <positive-input class="rider-input input-100" v-model='item.price'></positive-input>
                                <span>元</span>
                                <el-button :size='$size' class="rider-btn submit" @click="addApp" :disabled="!(item.price>=0 && item.startAt && item.endAt)||index!==formData.extraDefine.extras.length-1">添加</el-button>
                                <el-button :size='$size' class="rider-btn" type='danger' @click='removeApp(item)'
                                    :disabled="formData.extraDefine.extras.length==1">删除</el-button>
                            </li>
                        </ul>
                    </el-form>
                </div>
            </div>
            <!-- 抽成 -->
            <div class="line-flex-start take-p">
                <label>抽成比例:</label>
                <div class="line-flex-start" :class="{empty:(`take0`==emptyLine)}">
                    <span class="margin-right-20">平台抽成总运费的</span>
                    <positive-input class="rider-input input-150" :max='100' v-model='formData.drawOutRatio' suffix='%'></positive-input>
                </div>
            </div>
            <!-- 补贴 -->
            <div class="line-flex-start subsidy-p">
                <label>商家补贴:</label>
                <div class="line-flex-start" :class="{empty:(`subsidy0`==emptyLine)}">
                    <span class="margin-right-20">平台补贴总运费的</span>
                    <positive-input class="rider-input input-150" :max='100' v-model='formData.subsidyRatio' suffix='%'></positive-input>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PositiveInput from "./../all/PositiveNumInput";
import { mapMutations } from "vuex";
export default {
    components: {
        PositiveInput
    },
    // props: {
    //     form: {
    //         type: Object,
    //         required: true,
    //         default: () => ({
    //             orderType: "food",
    //             discountDefine: { isOpen: "1", discountRules: [{}] },
    //             extraDefine: { isOpen: "1", extras: [{}] },
    //             distances: [{}],
    //             price: ""
    //         })
    //     }
    // },
    data() {
        return {
            // formData: this.form,
            emptyLine: ""
        };
    },
    watch: {
        // form(val) {
        //     this.formData = val;
        // },
        formData: {
            handler(val) {
                this.saveTemplate({ key: "out", form: val });
            },
            deep: true
        }
    },
    computed: {
        formData() {
            return this.$store.state.template.out;
        }
    },
    methods: {
        ...mapMutations({
            saveTemplate: "template/saveTemplate"
        }),
        // gt0(type, index, e) {
        //     let data = this.formData;
        //     let change = null;
        //     if (type == "extra") {
        //         change = data.extraDefine.extras[index];
        //     }
        //     if (type == "distance") {
        //         change = data.distances[index];
        //     }
        //     if (type == "discount") {
        //         change = data.discountDefine.discountRules[index];
        //     }
        //     if (type == "weight") {
        //         change = data.weights[index];
        //     }
        //     if (type == "start") {
        //         if (data.price - 0 < 0) {
        //             data.price = 0 - data.price + "";
        //         }
        //         return;
        //     }
        //     for (let i in change) {
        //         if (i == "startAt" || i == "endAt") continue;
        //         if (change[i] - 0 < 0) {
        //             change[i] = 0 - change[i] + "";
        //         }
        //     }
        // },
        addDis() {
            this.formData.discountDefine.discountRules.push({});
        },
        removeDis(item) {
            var index = this.formData.discountDefine.discountRules.indexOf(
                item
            );
            if (index !== -1) {
                this.formData.discountDefine.discountRules.splice(index, 1);
            }
        },
        addApp() {
            this.formData.extraDefine.extras.push({});
        },
        removeApp(item) {
            var index = this.formData.extraDefine.extras.indexOf(item);
            if (index !== -1) {
                this.formData.extraDefine.extras.splice(index, 1);
            }
        },
        addDistance() {
            this.formData.distances.push({});
        },
        removeDistance(item) {
            var index = this.formData.distances.indexOf(item);
            if (index !== -1) {
                this.formData.distances.splice(index, 1);
            }
        },
        // 滚动到未填写完整项目
        scroll(item, line = 0) {
            let className = "";
            let go = [
                { itemName: "start", name: ".out-setting .start-p" },
                { itemName: "distance", name: ".out-setting .distance-p" },
                { itemName: "discount", name: ".out-setting .discount-p" },
                { itemName: "extra", name: ".out-setting .extra-p" },
                { itemName: "take", name: ".out-setting .take-p" },
                { itemName: "subsidy", name: ".out-setting .subsidy-p" }
            ];
            for (let i of go) {
                if (i.itemName == item) {
                    className = i.name;
                    this.emptyLine = `${i.itemName}${line}`;
                }
            }
            //滚动到块
            // let bottom = document.querySelector(className);
            this.$nextTick(() => {
                // 滚动到行
                let bottom = document.querySelector(".empty");
                bottom.scrollIntoView({ block: "center", behavior: "smooth" });
            });
        }
    }
};
</script>
<style lang="scss" scoped src='./templateSetting.scss'></style>

