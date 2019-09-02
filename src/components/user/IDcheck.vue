<template>
    <el-dialog :close-on-click-modal="false" append-to-body class="check-result" :visible.sync="open" width='600px' top='3vh'
        center v-if='open'>
        <h3 class="title">用户信息</h3>
        <div class="item line-start-start">
            <div class="label">用户ID:</div>
            <div class="detail">{{item.userId||'暂无'}}</div>
        </div>
        <div class="item line-start-start">
            <div class="label">手机号码:</div>
            <div class="detail">{{item.phone||'暂无'}}</div>
        </div>
        <div class="item line-start-start">
            <div class="label">性别:</div>
            <div class="detail">{{item.sex||'保密'}}</div>
        </div>
        <div class="item line-start-start">
            <div class="label">生日:</div>
            <div class="detail">{{item.idCardNum|IDtoBirth}}</div>
        </div>
        <div class="item line-start-start">
            <div class="label">真实姓名:</div>
            <div class="detail">{{item.realName||'暂无'}}</div>
        </div>
        <div class="item line-start-start">
            <div class="label">身份证号:</div>
            <div class="detail">{{item.idCardNum||'暂无'}}</div>
        </div>
        <div class="item line-start-start">
            <div class="label">身份证过期时间:</div>
            <div class="detail">{{item.validAt|formatTime('YYYY-MM-DD')}}</div>
        </div>
        <div class="line-start-start item-big-picture">
            <div class="label">身份证照片(正反面):</div>
            <div class="detail">
                <img :src='item.idCardImageFront' alt="正面" @click='$viewImage(item.idCardImageFront)' />
                <img :src='item.idCardImageBack' alt="背面" @click='$viewImage(item.idCardImageBack)' />
            </div>
        </div>
        <div class="line-start-start item-big-picture">
            <div class="label">手持身份证照片:</div>
            <div class="detail">
                <img :src='item.imageHand' @click='$viewImage(item.imageHand)' alt="手持" />
            </div>
        </div>
        <div slot='footer'>
            <h3 class="title">审核</h3>
            <!-- 审核 -->
            <el-form label-width="100px" v-if='item.authStatus=="SUBMIT"'>
                <el-form-item label='审核结果 :' style='text-align:left'>
                    <el-radio-group style='padding-left:20px;' v-model="checkValue">
                        <el-radio label="SUCCESS">通过</el-radio>
                        <el-radio label="FAILED">不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-input type='textarea' v-model='whyContent' v-if='checkValue=="FAILED"' placeholder='输入原因'></el-input>
                <el-button :size='$size' @click='open=false' :loading="loading">返回</el-button>
                <el-button :size='$size' type='primary' @click='submit' :loading="loading">确认</el-button>
            </el-form>
            <!-- 审核结果 -->
            <div class='checked' v-else>
                <div class="line-start-start">
                    <label>审核结果:</label>
                    <div class="detail">{{item.authStatus|AuthStatus}}</div>
                </div>
                <div class="line-start-start" v-if='item.authMessage'>
                    <label>审核原因:</label>
                    <div class="detail">{{item.authMessage}} </div>
                </div>
                <el-button :size='$size' @click='open=false' :loading="loading">返回</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        show: { type: Boolean, default: false },
        isCheck: { type: Boolean, default: true },
        item: { type: Object, default: {} }
    },
    data() {
        return {
            open: this.show,
            checkValue: "FAILED",
            whyContent: "",
            loading: false
        };
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            this.$emit("update:show", val);
            if (val === false) {
                this.checkValue = "FAILED";
                this.whyContent = "";
            }
        }
    },
    // computed: {
    //     birth() {
    //         let idNum = this.item.idCardNum;
    //         let arr = idNum.split("");
    //         if (!idNum) return;
    //         let birth = arr.splice(6, 8);
    //         let year = birth.splice(0, 4).join("");
    //         let month = birth.splice(0, 2).join("");
    //         let day = birth.splice(0, 2).join("");
    //         if (!(year && month && day)) return;
    //         return `${year}年${month}月${day}日`;
    //     }
    // },
    filters: {
        IDtoBirth(idNum) {
            if (idNum) {
                let arr = idNum.split("");
                if (!idNum) return;
                let birth = arr.splice(6, 8);
                let year = birth.splice(0, 4).join("");
                let month = birth.splice(0, 2).join("");
                let day = birth.splice(0, 2).join("");
                if (!(year && month && day)) return;
                return `${year} / ${month} / ${day}`;
            } else {
                return "暂无";
            }
        }
    },
    methods: {
        submit() {
            let data = {
                id: this.item.id,
                authMessage: this.whyContent,
                authStatus: this.checkValue
            };
            console.log(data);
            this.loading = true;
            this.$http
                .post(this.$api.checkID, data, true)
                .then(res => {
                    console.log("​submit -> res", res);
                    this.$emit("success");
                    this.open = false;
                    this.loading = false;
                    this.$notify({
                        title: "提示",
                        message: "成功",
                        type: "success"
                    });
                })
                .catch(err => {
                    console.log("​submit -> err", err);
                    this.$notify({
                        title: "提示",
                        message: "失败" + (err.message ? err.message : ""),
                        type: "warning"
                    });
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss" src='./check.scss' scoped></style>
