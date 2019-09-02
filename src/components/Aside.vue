
<template>
    <aside v-if='reloadMenu'>
        <div class="rider">
            <div class='logo' @click='toWelcome' :class="{hide:isCollapse}">XK DELIVERY</div>
            <div class='trigger' @click='trigger'><i class="icon-more-icon icon-trigger"></i></div>
        </div>
        <el-menu :unique-opened='true' active-text-color="#fff" :collapse="isCollapse" collapse-transition router
            :default-active="route">
            <template v-for='item in menu'>
                <!-- 一级 -->
                <el-submenu :key='item.name' :index='item.name' v-if='showFirstMenu(item)' class='first-sub'>
                    <template slot='title'>
                        <i :class="item.icon"></i>
                        <span>{{item.name}}</span>
                    </template>
                    <!-- 二级 -->
                    <template v-for='subitem in item.items'>
                        <!-- 二级多项 -->
                        <el-submenu :key='subitem.index' :index="subitem.index" v-if='showMenu(subitem)' class="second-sub">
                            <template slot='title'>
                                {{subitem.title}}
                            </template>
                            <!-- 二级子菜单 -->
                            <template v-for='detail in subitem.subs'>
                                <el-menu-item :index='detail.index' :key='detail.index' v-if='detail.show' class="third-item">{{detail.title}}</el-menu-item>
                            </template>
                        </el-submenu>
                        <!-- 二级单项 -->
                        <el-menu-item :key='subitem.index' :index='subitem.index' v-else-if='subitem.show' class="second-item">{{subitem.title}}</el-menu-item>
                    </template>
                </el-submenu>
            </template>
        </el-menu>
    </aside>
</template>
<script>
import { getSession } from "./../util/publicMehotds.js";
export default {
    props: {
        submenu: {
            type: [Object, Array]
        },
        open: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isCollapse: this.open,
            menu: require("./../menu/index.js").default,
            reloadMenu: true,
            user: getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {}
        };
    },
    watch: {
        open(val) {
            this.isCollapse = val;
        }
    },
    computed: {
        route() {
            let path = this.$route.path.replace("/", "");
            if (path === "welcome" || path === "areaHomePage") {
                this.reloadMenu = false;
                this.$nextTick(() => {
                    this.reloadMenu = true;
                });
            }
            return path;
        }
    },

    methods: {
        toWelcome() {
            if (this.user.role[0].roleType == "SYSTEM") {
                this.$router.replace({ name: "areaHomePage" });
                return;
            }
            this.$router.replace({ name: "welcome" });
        },
        trigger() {
            this.isCollapse = !this.isCollapse;
            this.$emit("update:open", this.isCollapse);
            this.$emit("trigger", this.isCollapse);
        },
        showMenu(item) {
            if (item.subs[0] && item.subs.length > 0) {
                return item.subs.some(value => value.show === true);
            }
        },
        showFirstMenu(item) {
            if (item.items[0] && item.items.length > 0) {
                let roleType = this.user.role[0].roleType;
                let menuType = item.type;
                // 区分区域管理和平台运营
                if (roleType == "SYSTEM" && menuType == "notArea") {
                    return false;
                }
                if (roleType !== "SYSTEM" && menuType == "area") {
                    return false;
                }
                if (item.items.some(value => value.show === true)) {
                    return true;
                }
                for (let key in item.items) {
                    if (item.items.hasOwnProperty(key)) {
                        if (
                            item.items[key].subs.length > 0 &&
                            item.items[key].subs.some(
                                value => value.show === true
                            )
                        ) {
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }
};
</script>
<style lang="scss">
$maincolor: #6d7083;
$hovercolor: #8b91b3;
$topcolor: #6d7083;
$titlecolor: #fff;
$second-title-padding-left: 39px !important;
$second-title-margin-left: 22px !important;
$last-title-padding-left: 45px !important;
$last-title-margin-left: 22px !important;
// 关闭之后的菜单弹出框样式
.el-menu--vertical {
    .el-menu {
        background: $maincolor !important;
    }
    .el-submenu__title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: $titlecolor;
        font-size: 16px;
        padding-left: 22px !important;

        span {
            margin-left: 15px;
        }
        > i {
            color: #fff;
            width: 20px;
            text-align: center;
        }
    }
    .el-submenu__title:hover {
        background-color: $hovercolor;
    }
    // 关闭之后指向弹出框
    .el-menu-item {
        color: #fff;
        &:hover {
            background: $hovercolor;
        }
    }
}
aside {
    .el-menu {
        background: transparent;
        color: #fff;
        border: 0;
        .el-submenu {
            // 一级大标题样式覆盖  el-submenu__title
            .el-submenu__title {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color: $titlecolor;
                font-size: 16px;
                padding-left: 22px !important;

                span {
                    margin-left: 15px;
                }
                > i {
                    color: #fff;
                    width: 20px;
                    text-align: center;
                }
            }
            .el-submenu__title:hover {
                background-color: $hovercolor;
            }
            .el-submenu__title:focus {
                background-color: $hovercolor;
            }
            &.is-active {
                background-color: transparent;
            }
            &.is-opened {
                background-color: transparent;
                .el-submenu__title {
                    color: #fff;
                }
            }
            .el-menu--inline {
                padding-left: 30px !important;
                background: $maincolor;
            }
            .el-menu-item {
                color: $titlecolor;
                height: 35px;
                line-height: 35px;
                // margin: 7px 0;
                font-size: 14px;
            }
            .el-menu-item:hover {
                background: $hovercolor !important;
                color: #fff;
            }
            .el-menu-item.is-active {
                background: $hovercolor !important;
                color: #fff;
            }

            // 二级菜单容器
            ul.el-menu {
                padding-left: 0px !important;

                .el-submenu {
                    margin-bottom: 5px;
                    .el-submenu__title {
                        height: 35px;
                        color: $titlecolor;
                        font-size: 14px;
                        padding-left: $second-title-padding-left;
                        margin-left: $second-title-margin-left;
                    }
                }
                .el-menu-item {
                    color: $titlecolor;
                    font-size: 14px;
                    margin-top: 5px;
                    padding-left: $last-title-padding-left;
                    margin-left: $last-title-margin-left;
                    text-align: left;
                    &:hover {
                        background-color: $hovercolor;
                    }
                    &:focus {
                        background-color: $hovercolor;
                    }
                }
            }
            .el-submenu__icon-arrow {
                color: $titlecolor;
            }
        }
    }
    .rider {
        height: 80px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        align-items: center;
        background-color: $topcolor;
        font-family: Impact;
        font-size: 20px;
        color: #fff;
        letter-spacing: 0;
        .trigger {
            min-width: 16px;
            min-height: 14px;
            .icon-trigger {
                font-size: 16px;
            }
        }
    }
    .icon-style {
        font-size: 20px;
        color: #fff !important;
    }
    .hide {
        width: 0;
        opacity: 0;
        transition: all 1s;
    }
    .logo {
        font-family: Impact;
        height: 30px;
        line-height: 30px;
        font-weight: bold;
        font-size: 20px;
        color: #fff;
        overflow: hidden;
        letter-spacing: 0.5px;
    }
}
</style>

