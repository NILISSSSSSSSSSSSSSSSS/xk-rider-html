<template>
    <el-dialog :close-on-click-modal="false" title='用户信息' modal-append-to-body :visible.sync="open" width='500px' v-if='infos'>
        <div class="user-detail">
            <div class="line">
                <div class="left">用户ID:</div>
                <div class="right">{{infos.id||'暂无'}}</div>
            </div>
            <div class="line">
                <div class="left">手机号码:</div>
                <div class="right">{{infos.phone||'暂无'}}</div>
            </div>
            <div class="line">
                <div class="left">真实姓名:</div>
                <div class="right">{{infos.realName||'暂无'}}</div>
            </div>
            <div class="line">
                <div class="left">身份证号码:</div>
                <div class="right">{{infos.idCardNum||'暂无'}}</div>
            </div>
            <div class="line">
                <div class="left">健康证号码:</div>
                <div class="right">{{infos.healthCardNum||'暂无'}}</div>
            </div>
            <div class="line">
                <div class="left">所在区域:</div>
                <div class="right">{{infos.cityCode|getCityName}}-{{infos.districtCode|getDistrictName}}</div>
            </div>
            <div class="line">
                <div class="left">是否关联商户:</div>
                <div class="right">{{"暂无"}}</div>
            </div>
            <div class="line">
                <div class="left">商户名称:</div>
                <div class="right">{{"暂无"}}</div>
            </div>
            <div class="line">
                <div class="left">商户联系方式:</div>
                <div class="right">{{"暂无"}}</div>
            </div>
            <div class="line">
                <div class="left">所属区域负责人:</div>
                <div class="right">{{infos.partnerName?infos.partnerName:"暂未绑定"}}</div>
            </div>
            <div class="line">
                <div class="left">区域负责人联系方式:</div>
                <div class="right">{{infos.partnerPhone?infos.partnerPhone:"暂无"}}</div>
            </div>
        </div>
        <div class="btn-group" slot='footer'>
            <el-button type='primary' :size='$size' @click='open=false'>关闭</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        uid: {
            type: [Number, String],
            require: true
        }
    },
    data() {
        return { open: this.show, infos: null };
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            if (!val) {
                this.$emit("update:show", val);
                this.infos = null;
            } else {
                this.getDetail();
            }
        }
    },
    methods: {
        getDetail() {
            if (!this.uid) return;
            this.$http
                .get(this.$api.userRiderDetail, { uid: this.uid }, true)
                .then(res => {
                    console.log("​getDetail -> res", res);
                    this.infos = res;
                    this.$loading().close();
                })
                .catch(err => {
                    console.log("​getDetail -> err", err);
                    this.$message.error("获取详情失败");
                    this.$loading().close();
                    this.open = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.user-detail {
    padding: 20px;
    .line {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
        .left {
            width: 145px;
            text-align: right;
        }
        .right {
            width: 250px;
            word-wrap: break-word;
            padding-left: 20px;
            text-align: left;
        }
    }
}
</style>

