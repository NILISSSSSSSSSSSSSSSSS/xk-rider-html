

<template>
    <div class="login" @mouseup="showPassword=false">
        <div class="login-info">
            <!-- <img src="./../assets/image/login/login.png"> -->
            <div class="rider-system">
                <div class="name">XIAOKE DELIVERY</div>
                <div class="name2">
                    <div class="line1">晓可配送后台管理系统</div>
                    <div class="line2">Xiao Ke square backstage management system</div>
                </div>
            </div>
        </div>
        <div class="form">
            <div class="title1">sign up</div>
            <div class="title2">登录</div>
            <el-form @keyup.enter.native='submit'>
                <el-form-item>
                    <el-input class='login-input' type='account' placeholder="请输入用户名" clearable v-model.trim='loginInfo.phone'
                        @blur='savePwd()'>
                        <i slot='prefix' class="icon-user icon-login"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input class='login-input' :type='showPassword?"text":"password"' placeholder="请输入密码"
                        v-model.trim='loginInfo.password' autocomplete="new-password" @blur='savePwd()'>
                        <i slot='prefix' class="icon-password icon-login"></i>
                        <i slot="suffix" class="icon-eye-blocked icon-login-right" @mousedown="showPassword=true"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='submit' :loading="loading">登录</el-button>
                </el-form-item>
                <div class="remember">
                    <el-checkbox v-model="remember">记住密码</el-checkbox>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import {
    detectOS,
    saveSession,
    saveLocalStorage,
    getLocalStorage
} from "./../util/publicMehotds.js";
import { loginInit } from "./../util/dictionaries";
export default {
    data() {
        return {
            loginInfo: {
                phone: "",
                password: "",
                guid: "xk-pc",
                os: detectOS()
            },
            loading: false,
            showPassword: false,
            remember: false
        };
    },
    created() {
        this.getPwd();
    },
    watch: {
        remember(val) {
            if (val) {
                this.savePwd();
            } else {
                localStorage.removeItem("remember");
            }
        }
    },
    methods: {
        savePwd() {
            if (!this.remember) return;
            saveLocalStorage("remember", JSON.stringify(this.loginInfo));
        },
        getPwd() {
            let rem = getLocalStorage("remember");
            if (rem) {
                this.remember = true;
            }
            let info = JSON.parse(rem ? rem : "{}");
            console.log("TCL: getPwd -> info", info);
            this.loginInfo = {
                phone: "",
                password: "",
                guid: "xk-pc",
                os: detectOS(),
                ...info
            };
        },
        submit() {
            if (!this.loginInfo.phone) {
                this.$message.error("请输入您的用户名");
                return;
            }
            if (!this.loginInfo.password) {
                this.$message.error("请输入您的密码");
                return;
            }
            // if (this.loginInfo.password.length < 5) {
            //     this.$message.error("密码不能小于5位");
            //     return;
            // }
            this.loading = true;
            this.savePwd();
            // this.savePermissionHeader();
            this.login();
        },
        login() {
            console.log(this.loginInfo);
            this.$http
                .post(this.$api.login, this.loginInfo, true)
                .then(res => {
                    console.log("登录", res);
                    let xkRole = res.role[0].services || [];
                    console.log("xk-role", xkRole);
                    saveSession("xk-user", JSON.stringify(res));
                    saveSession("xk-role", JSON.stringify(xkRole));
                    this.$message.success("登录成功");
                    loginInit();
                    this.savePermissionHeader(
                        res.role[0].roleType,
                        res.role[0].name
                    );
                })
                .catch(err => {
                    console.log("​login -> err", err);
                    this.loading = false;
                    this.$message.error(
                        `登录失败${err.message ? "," + err.message : ""}`
                    );
                });
        },
        savePermissionHeader(roleType, roleName) {
            let menu = require("./../menu/index.js").default;
            let otherMenu = require("./../menu/index.js").otherMenu;
            console.log("TCL: savePermissionHeader -> menu", menu);
            console.log("TCL: savePermissionHeader -> otherMenu", otherMenu);
            let map = {};
            // let headMenu = {};
            for (let key in menu) {
                // if (roleType == "SYSTEM" && menu[key].type == "notArea") {
                //     continue;
                // }
                let flag = false;
                if (menu.hasOwnProperty(key)) {
                    for (let item of menu[key].items) {
                        if (item.subs.length > 0) {
                            for (let val of item.subs) {
                                map[`${val.index}`] = val.show;
                                if (val.show && !flag) {
                                    flag = true;
                                }
                            }
                        } else {
                            map[`${item.index}`] = item.show;
                            if (item.show && !flag) {
                                flag = true;
                            }
                        }
                    }
                    // if (flag) {
                    //     headMenu[`${key}`] = {
                    //         name: menu[`${key}`].name
                    //     };
                    // }
                }
            }
            console.log("permission", { ...map, ...otherMenu });
            saveSession("permission", JSON.stringify({ ...map, ...otherMenu }));
            // saveSession("headMenu", JSON.stringify(headMenu));
            setTimeout(() => {
                if (roleType == "SYSTEM") {
                    this.loading = false;
                    this.$router.push({ path: "/areaHomePage" });
                } else {
                    this.loading = false;
                    this.$router.push({ path: "/welcome" });
                }
                // 恢复退出前的页面
                this.openSavePage(roleType, roleName);
            }, 500);
        },
        openSavePage(roleType, rName) {
            let savePath = JSON.parse(localStorage.getItem("savePath"));
            let path = "";
            let flag = false;
            let roleName = "";
            if (savePath) {
                path = savePath.path.replace("/", "");
                let time = savePath.time;
                roleName = savePath.roleName;
                let now = new Date().getTime();
                if (now - time > 1 * 60 * 1000) {
                    flag = false;
                } else {
                    flag = true;
                }
            } else {
                flag = false;
            }
            console.log(path);
            console.log(flag);
            console.log(roleName);
            if (
                flag &&
                path !== "areaHomePage" &&
                path !== "welcome" &&
                roleName == rName
            ) {
                let query = localStorage.getItem("saveQuery");
                if (query) {
                    this.$router.push({
                        name: path,
                        query: JSON.parse(query)
                    });
                } else {
                    this.$router.push({ name: path });
                }
            } else {
                if (roleType == "SYSTEM") {
                    this.loading = false;
                    this.$router.push({ path: "/areaHomePage" });
                } else {
                    this.loading = false;
                    this.$router.push({ path: "/welcome" });
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.login {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 1200px;
    background: #474a5b;
    .login-info {
        position: absolute;
        top: 17.8%;
        left: 14%;
        z-index: 1;
        width: 64%;
        height: 64%;
        min-width: 800px;
        min-height: 400px;
        background: url("./../assets/image/login/login.jpg") no-repeat;
        .rider-system {
            position: relative;
            z-index: 1;
            color: #fff;
            height: 100%;
            // padding: 135px 45px;
            // padding: 14% 4.5%;
            .name {
                position: absolute;
                left: 4.5%;
                top: 14.2%;
                font-family: Impact;
                font-size: 40px;
            }
            .name2 {
                position: absolute;
                left: 4.5%;
                bottom: 14.2%;
                // transform: translateY(-100%);
                .line1 {
                    font-family: PingFangSC-Semibold;
                    font-size: 40px;
                    color: #ffffff;
                }
                .line2 {
                    font-family: PingFangSC-Semibold;
                    font-size: 24px;
                    color: #c2c2c2;
                }
            }
        }
    }
    .form {
        width: 27%;
        // min-height: 76%;
        position: absolute;
        top: 50%;
        right: 14%;
        transform: translateY(-50%);
        background: #fff;
        border-radius: 10px;
        padding: 5% 4% 6% 4%;
        z-index: 2;
        .title1 {
            opacity: 0.8;
            font-family: Impact;
            font-size: 50px;
            color: #393857;
        }
        .title2 {
            opacity: 0.8;
            font-family: PingFangSC-Semibold;
            font-size: 36px;
            color: #393857;
        }
    }
    .el-form {
        margin-top: 17.7%;
        .el-form-item {
            margin-bottom: 34px;
            /deep/ .el-input {
                height: 7.7%;
                min-height: 40px;
                .el-input__inner {
                    line-height: 7.7%;
                    background: transparent;
                    border: 0;
                    padding-left: 50px;
                    border-bottom: 1px solid #9b99e6;
                }
                /deep/ .icon-login {
                    font-size: 20px;
                    color: rgba(57, 56, 87, 0.3);
                    position: absolute;
                    left: 5px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                /deep/ .icon-login-right {
                    font-size: 20px;
                    color: rgba(57, 56, 87, 0.3);
                    position: absolute;
                    right: 5px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
        .el-button {
            width: 100%;
            background: #9795e3;
            border-radius: 4px;
            border: 0;
            margin-top: 14%;
        }
    }
    // .el-form {
    //     margin-top: 26%;
    // }
    // .el-form-item:first-child {
    //     margin-bottom: 40px;
    // }
    // .el-form-item:nth-child(2) {
    //     margin-bottom: 2px;
    // }
    // .el-button {
    //     width: 100%;
    //     margin-top: 30%;
    // }
    // .el-form-item {
    //     .el-input {
    //         width: 100%;
    //         height: 40.5px;
    //         margin: 0 auto;
    //         input {
    //             padding: 0 45px;
    //         }
    //     }
    //     /deep/ .icon-login {
    //         font-size: 20px;
    //         color: #393857;
    //         position: absolute;
    //         left: 15px;
    //         top: 50%;
    //         transform: translateY(-50%);
    //     }
    // }
}
.remember {
    text-align: right;
    opacity: 0.5;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #393857;
}
</style>

