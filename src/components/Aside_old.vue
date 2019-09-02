<style lang="scss">
aside {
    .el-menu {
        background: transparent;
        color: #fff;
        border: 0;
        .el-submenu__title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: rgba(255, 255, 255, 0.6);
            font-size: 16px;
            span {
                margin-left: 15px;
            }
        }
        .el-submenu__title:hover {
            background-color: #30304d;
        }
        .el-submenu.is-active {
            background-color: #30304d;
        }
        .el-submenu.is-opened {
            background-color: #30304d;
            .el-submenu__title {
                color: #fff;
            }
        }
        .el-menu--inline {
            padding-left: 20px !important;
            background: #393857;
        }
        .el-menu-item {
            color: rgba(255, 255, 255, 0.6);
            height: 30px;
            line-height: 30px;
            margin: 10px 0;
            font-size: 14px;
        }
        .el-menu-item:hover {
            background: rgba(255, 255, 255, 0.05) !important;
            color: #fff;
        }
        .el-menu-item.is-active {
            background: rgba(255, 255, 255, 0.05) !important;
            color: #fff;
        }
    }
    .rider {
        height: 70px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        align-items: center;
        background-color: #30304d;
        .trigger {
            min-width: 16px;
            min-height: 14px;
            img {
                width: 16px;
                height: 14px;
                display: block;
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
    }
}
</style>

<template>
    <aside>
        <div class="rider">
            <div
                class='logo'
                :class="{hide:isCollapse}"
            >晓可骑士</div>
            <div
                class='trigger'
                @click='trigger'
            ><img
                    src="./../assets/image/menu.png"
                    alt=""
                ></div>
        </div>
        <el-menu
            unique-opened
            active-text-color="#fff"
            :collapse="isCollapse"
            collapse-transition
            router
            :default-active="route"
        >
            <template v-for='item in submenu'>
                <el-submenu
                    :key='item.index'
                    :index='item.index'
                    v-if='showMenu(item)'
                >
                    <template slot='title'>
                        <i
                            :class="item.icon"
                            class="icon-style"
                        ></i>
                        <span>{{item.title}}</span>
                    </template>
                    <el-menu-item
                        v-for='(subitem,subindex) in item.subs'
                        :key='subindex'
                        :index='subitem.index'
                        v-if='subitem.show'
                    >
                        {{subitem.title}}
                    </el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </aside>
</template>
<script>
export default {
    props: {
        submenu: {
            type: [Object, Array]
        }
    },
    data() {
        return {
            isCollapse: false
        };
    },
    computed: {
        route() {
            return this.$route.path.replace("/", "");
        }
    },
    mounted() {
        console.log(menu);
    },
    methods: {
        trigger() {
            this.isCollapse = !this.isCollapse;
            this.$emit("trigger", this.isCollapse);
        },
        showMenu(item) {
            return item.subs.some(value => value.show === true);
        }
    }
};
</script>
