<template>
    <div class="welcome rider-container" v-show="Object.keys(all).length>0">
        <div class="line-flex-start line-1">
            <div class="left">
                <div class="welcome-info">{{nowTimeWelcome}}</div>
                <div class="user-type">{{user.role[0].name}}</div>
            </div>
            <div class="right">
                <div class="title">便捷导航</div>
                <div class="router">
                    <el-row>
                        <el-col :span="8"><span class="point-style" @click='go("orderList")'>订单列表</span></el-col>
                        <el-col :span="8"><span class="point-style" @click='go("riderList")'>骑士列表</span></el-col>
                        <el-col :span="8"><span class="point-style" @click='goSetting'>平台设置</span></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8"><span class="point-style" @click='go("publish")'>发布推送</span></el-col>
                        <el-col :span="8"><span class="point-style" @click='go("withdrawLimit")'>提现额度设置</span></el-col>
                        <el-col :span="8"><span class="point-style" @click='go("incomeDetail")'>平台收入明细</span></el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="line-flex-start line-2">
            <div class="left">
                <div class="title">待办事项</div>
                <div class="wait-deal line-space-between">
                    <div class="item" @click='go("wrongOrderList")'>
                        <div class="name">异常订单</div>
                        <div class="number">{{(all.oneCount+all.twoCount)||0}}</div>
                        <i class="icon-3 item-icon"></i>
                    </div>
                    <div class="item" @click='go("refuseOrderCheck")'>
                        <div class="name">取消订单审核</div>
                        <div class="number">{{all.cancelOrderAuth||0}}</div>
                        <i class="icon-2 item-icon"></i>
                    </div>
                    <div class="item" @click='go("peoplePlatformCheck")'>
                        <div class="name">身份证审核</div>
                        <div class="number">{{all.idCardAuth||0}}</div>
                        <i class="icon-1 item-icon"></i>
                    </div>
                    <div class="item" @click='go("peoplePlatformCheck","health")'>
                        <div class="name">健康证审核</div>
                        <div class="number">{{all.healthCardAuth||0}}</div>
                        <i class="icon-4 item-icon"></i>
                    </div>
                    <div class="item" @click='go("withdrawCheck")'>
                        <div class="name">提现审核</div>
                        <div class="number">{{all.cashCount||0}}</div>
                        <i class="icon-uniE93E item-icon"></i>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="title">区域负责人</div>
                <div class="rider-table">
                    <el-table :size='$size' fit max-height='240' :data='tableData' :style='{"box-shadow":"0 0 0 0"}'
                        :header-cell-style="{'background':'rgba(139, 145, 179, 0.5)','color':'#fff'}">
                        <el-table-column label='所属区域' prop='id'>
                            <template slot-scope="scope">
                                {{scope.row.districtCode|getDistrictName}}
                            </template>
                        </el-table-column>
                        <el-table-column label='姓名' prop='realName'></el-table-column>
                        <el-table-column label='联系方式' prop='phone'></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div class="line-3">
            <div class="title">当前数据（今日）</div>
            <div class="today-detail">
                <div class="line-space-between">
                    <div class="item">
                        <div class="now-title">当前订单</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.doneCount||0}}</div>
                        <div class="name">已完成订单</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.waitCount||0}}</div>
                        <div class="name">接单订单</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.waitPickUpCount||0}}</div>
                        <div class="name">待取货订单</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.driverCount||0}}</div>
                        <div class="name">配送中订单</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.oneCount||0}}</div>
                        <div class="name">异常订单(一级)</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.twoCount||0}}</div>
                        <div class="name">异常订单(二级)</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.cancelCount||0}}</div>
                        <div class="name">已取消订单</div>
                    </div>
                </div>
                <div class="line-flex-start">
                    <div class="item">
                        <div class="now-title">当前骑士</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.accessCount||0}}</div>
                        <div class="name">工作中骑士</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.notAccessCount||0}}</div>
                        <div class="name">休息中骑士</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.allCount||0}}</div>
                        <div class="name">已注册骑士</div>
                    </div>
                    <div class="item">
                        <div class="number">{{all.frozenCount||0}}</div>
                        <div class="name">已冻结骑士</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getSession, getPermission } from "./../util/publicMehotds.js";
export default {
    data() {
        return {
            user: getSession("xk-user")
                ? JSON.parse(getSession("xk-user"))
                : {},
            tableData: [],
            all: {},
            timer: null,
            loading: null
        };
    },
    computed: {
        nowTimeWelcome() {
            let time = new Date().getHours();
            let name = this.user.realName ? this.user.realName : "";
            let str = "祝您今天工作顺心，开心每一天！";
            let timeStr = "";
            if (time < 12) {
                timeStr = "早上好";
            } else if (time > 18) {
                timeStr = "晚上好";
            } else if (time > 12 && time < 13) {
                timeStr = "中午好";
            } else {
                timeStr = "下午好";
            }
            return `${timeStr} , ${name} , ${str}`;
        }
    },
    created() {
        this.createLoading();
        this.getDetail();
        this.timer = setInterval(() => {
            this.getDetail();
        }, 10000);
    },
    destroyed() {
        clearInterval(this.timer);
    },
    methods: {
        createLoading() {
            this.loading = this.$loading({
                lock: true,
                text: "加载中",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
        },
        closeLoading() {
            if (this.loading) {
                setTimeout(() => {
                    this.loading.close();
                    this.loading = null;
                }, 500);
            }
        },
        go(routerName, query) {
            this.$router.push({ name: routerName, query: { q: query } });
        },
        goSetting() {
            let settingIndex = getPermission("riderCreate")
                ? "getOrderSetting"
                : getPermission("accessOrderSetting")
                ? "getOrderSetting"
                : getPermission("transOrderSetting")
                ? "transOrderSetting"
                : getPermission("exceptionOrderSetting")
                ? "errorDealSetting"
                : getPermission("refuseOrderSetting")
                ? "refuseSetting"
                : getPermission("riderDistanceSetting")
                ? "arriveSetting"
                : "serviceNumberSetting";
            this.go(settingIndex);
        },
        getDetail() {
            this.$http
                .get(this.$api.welcome, {}, true)
                .then(res => {
                    console.log("​getDetail -> res", res);
                    this.all = res;
                    this.tableData = res.partner || null;
                    this.closeLoading();
                })
                .catch(err => {
                    console.log("​getDetail -> err", err);
                    this.$message.error("获取首页数据失败," + err.message);
                    this.closeLoading();
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.welcome {
    width: 100%;
    height: 100%;
    background: #474a5b;
    padding: 0 51px 37px 30px;
    overflow: auto;
    > .line-flex-start {
        min-width: 1200px;
        margin-bottom: 30px;
        > .left {
            width: 66.3%;
            min-width: 800px;
            height: 100%;
            margin-right: 1.9%;
            background: #6d7083;
            // overflow: auto;
            box-shadow: 0 4px 30px 0 rgba(0, 0, 0, 0.5);
            position: relative;
        }
        > .right {
            background: #6d7083;
            width: 31.8%;
            min-width: 400px;
            height: 100%;
            box-shadow: 0 4px 30px 0 rgba(0, 0, 0, 0.5);
            overflow: hidden;
            position: relative;
        }
    }
    > .line-1 {
        height: 190px;
        // overflow: auto;
        .left {
            background: #8b91b3;
            padding: 44px 0 43px 40px;
            overflow: auto;
            .welcome-info {
                // min-width: 900px;
                font-family: PingFangSC-Semibold;
                font-size: 36px;
                color: #ffffff;
                line-height: 50px;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .user-type {
                opacity: 0.6;
                font-family: PingFangSC-Medium;
                font-size: 24px;
                color: #ffffff;
                line-height: 33px;
                margin-top: 20px;
            }
        }
        .right {
            .router {
                height: 130px;

                padding: 30px;
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #ffffff;
                .el-row:first-child {
                    margin-bottom: 20px;
                    min-width: 300px;
                    .el-col {
                        min-width: 100px;
                    }
                }
            }
        }
    }
    > .line-2 {
        height: 300px;
        .left {
            .wait-deal {
                padding: 30px;
                .item {
                    width: 16.6%;
                    max-width: 176px;
                    min-width: 155px;
                    height: 180px;
                    background: rgba(139, 145, 179, 0.5);
                    border-radius: 8px;
                    padding: 26px 29px;
                    position: relative;
                    .number {
                        margin-top: 8px;
                    }
                    .item-icon {
                        font-size: 35px;
                        position: absolute;
                        bottom: 9px;
                        right: 10px;
                    }
                }
            }
        }
        .right {
            .rider-table {
                .el-table {
                    // 空白表格
                    /deep/ .el-table__empty-block {
                        background: transparent;

                        span {
                            color: #ddd;
                        }
                    }
                }
            }
        }
    }
    > .line-3 {
        height: 409px;
        overflow: auto;
        background: #6d7083;
        box-shadow: 0 4px 30px 0 rgba(0, 0, 0, 0.5);
        min-width: 1223px;
        position: relative;
        .today-detail {
            padding: 110px 90px 0;
            height: 100%;
            overflow: auto;
            .line-space-between {
                .item {
                    width: 12.5%;
                    height: 97px;
                    min-width: 150px;
                    text-align: center;

                    // margin-left:80px;
                    .name {
                        margin-top: 17px;
                    }
                    .now-title {
                        line-height: 97px;
                        color: #fff;
                    }
                }
            }
            .line-flex-start {
                margin-top: 39px;
                .item {
                    width: 12.5%;
                    min-width: 150px;
                    height: 97px;
                    text-align: center;

                    .name {
                        margin-top: 17px;
                    }
                    .now-title {
                        line-height: 97px;
                        color: #fff;
                    }
                }
            }
        }
    }
    .title {
        height: 60px;
        width: 100%;
        font-family: PingFangSC-Medium;
        font-size: 17px;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 60px;
        padding-left: 30px;
        background: #8b91b3;
        position: absolute;
        top: 0;
    }
    .rider-table {
        padding: 0;
        width: 100%;
    }
    .name {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #ffffff;
        line-height: 22px;
    }
    .number {
        font-family: Impact;
        font-size: 48px;
        color: #ffffff;
        letter-spacing: 0;
        line-height: 58px;
    }
    .wait-deal,
    .rider-table,
    .router {
        margin-top: 60px;
        overflow: auto;
    }
}
</style>