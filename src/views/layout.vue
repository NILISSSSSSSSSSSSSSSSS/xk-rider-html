<template>
    <!-- <div class="layout"> -->
    <el-container class="all-container">
        <el-aside :width='width'>
            <!-- <Aside
                    :submenu='asideMenu'
                    @trigger='getTrigger'
                ></Aside> -->
            <Aside @trigger='getTrigger' :open.sync='isOpen'></Aside>
        </el-aside>
        <el-container>
            <el-header height='80px'>
                <!-- <nav>
                        <el-menu
                            mode='horizontal'
                            :default-active='menuKey'
                        >
                            <el-menu-item
                                v-for='(item,key) in headMenu'
                                :key='key'
                                :index="key+''"
                                @click='changeAside(key)'
                            >{{item.name}}</el-menu-item>
                        </el-menu>
                    </nav> -->
                <el-badge :is-dot='false' class="item"><i class="icon-bell bell-style" @click='toMap'></i></el-badge>
                <el-dropdown trigger='click' placement='bottom' :size='$size' @command="handleCommand">
                    <div>
                        <img class="head" :src="user.avatar||'./../assets/image/face_icon.png'" alt="">
                        <div class="name">{{user.realName||'你好'}}</div>
                    </div>

                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-main>
                <transition name="fade-transverse">
                    <router-view :key='nowTime' />
                </transition>
            </el-main>
        </el-container>
    </el-container>
    <!-- <Dialog></Dialog> -->
    <!-- </div> -->
</template>
<script>
import Aside from "./../components/Aside";
import { getSession, loginOut } from "./../util/publicMehotds.js";
export default {
    components: {
        Aside
    },
    data() {
        return {
            user: getSession("xk-user")
                ? JSON.parse(getSession("xk-user"))
                : {},
            // menuList: require("../menu/index.js").default,
            nowTime: new Date().getTime(),
            // menuIndex: 0,
            // headMenu: getSession("headMenu")? JSON.parse(getSession("headMenu")): {},
            // menuKey: getSession("menuKey"),
            // asideMenu: {},
            width: "232px",
            isOpen: false,
            clickNum: 0,
            mapTimer: null
        };
    },
    created() {
        // this.firstIn();
        this.listenScreen();
    },
    computed: {
        route() {
            this.saveLeavePage();
            this.nowTime = new Date().getTime();
            return this.$route.path;
        }
    },
    methods: {
        // 保存离开的信息
        saveLeavePage() {
            console.log("path", this.$route.path);
            console.log("query", this.$route.query);
            let pathObj = {
                path: this.$route.path,
                time: new Date().getTime(),
                roleName: this.user.role[0].name
            };
            localStorage.setItem("savePath", JSON.stringify(pathObj));
            if (Object.keys(this.$route.query).length > 0) {
                localStorage.setItem(
                    "saveQuery",
                    JSON.stringify(this.$route.query)
                );
            } else {
                localStorage.removeItem("saveQuery");
            }
        },
        listenScreen() {
            window.onresize = e => {
                // console.log("p-a-h", screen.availHeight);
                // console.log("w-o-h", window.outerHeight);
                // console.log("p-a-w", screen.availWidth);
                // console.log("w-o-w", window.outerWidth);
                if (screen.availWidth - window.outerWidth > 100) {
                    this.getTrigger(true);
                    this.isOpen = true;
                } else {
                    this.getTrigger(false);
                    this.isOpen = false;
                }
            };
        },
        handleCommand(command) {
            if (command == "loginOut") {
                this.$confirm("确认退出?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(res => {
                    loginOut();
                });
            }
        },
        toMap() {
            if (this.mapTimer) {
                clearTimeout(this.mapTimer);
                this.mapTimer = null;
            }
            this.clickNum++;
            if (this.clickNum == 10) {
                // this.$prompt("输入验证", "提示", {
                //     confirmButtonText: "确定",
                //     cancelButtonText: "取消",
                //     closeOnClickModal: false
                // }).then(({ value }) => {
                //     if (value == "gotomap") {
                this.clickNum = 0;
                this.$router.push("/map");
                //     }
                // });
            }
            this.mapTimer = setTimeout(() => {
                this.clickNum = 0;
            }, 2000);
        },
        // getIndex(e) {
        //     console.log(e);
        // },
        // firstIn() {
        //     if (this.menuKey) {
        //         this.asideMenu = this.menuList[`${this.menuKey}`].items;
        //     } else {
        //         for (let key in this.headMenu) {
        //             this.menuKey = key;
        //             this.asideMenu = this.menuList[`${key}`].items;
        //             return;
        //         }
        //     }
        // },
        // changeAside(k) {
        //     saveSession("menuKey", k);
        //     this.menuKey = k;
        //     this.asideMenu = this.menuList[`${k}`].items;
        // },
        getTrigger(t) {
            if (t) {
                this.width = "64px";
            } else {
                this.width = "232px";
            }
        }
    }
};
</script>
<style lang="scss" scoped>
$aside-color: #6d7083;
$header-bg: #474a5b;
$header-height: 80px;
$main-bg: #3c4052;
// .layout {
//     height: 100%;
.all-container {
    height: 100%;
    .el-aside {
        background: $aside-color;
        height: 100%;
        transition: all 1s;
    }
    .el-header {
        // background: url("http://gc.xksquare.com/sh-headBack.png") no-repeat;
        background: $header-bg;
    }
    .el-main {
        height: 100%;
        padding: 0;
        background: $main-bg;
    }
}
// }
.el-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .bell-style {
        font-size: 22px;
        color: #fff;
        // margin-right: 43px;
    }
    .el-badge {
        /deep/ sup {
            background: #2df400;
        }
    }
    .el-dropdown {
        margin-right: 10px;
        margin-left: 43px;
        // position: absolute;
        // right: 30px;
        // top: 50%;
        // transform: translateY(-50%);
        .name,
        .head {
            display: inline-block;
            // line-height: 70px;\
            vertical-align: middle;
        }
        img.head {
            width: 42px;
            height: 42px;
            margin-right: 10px;
            background: #ddd;
            border-radius: 50%;
        }
        div.name {
            height: 28px;
            line-height: 25px;
            font-size: 28px;
            color: #fff;
        }
    }
}
</style>