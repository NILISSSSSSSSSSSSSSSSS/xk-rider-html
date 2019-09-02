<template>
    <div class="platform-setting rider-container">
        <div class="rider-switch">
            <div class="tab" v-for='(item,index) in settingList' v-show='item.show' :key='index' :class="{'active':nowTab==item.value}"
                @click='switchTab(item.value,item.type)'>{{item.label}}</div>
        </div>
        <transition name="fade-transverse">
            <router-view :key='keyTime'></router-view>
        </transition>
    </div>
</template>
<script>
import {
    getOrderSetting,
    transOrderSetting,
    errorDealSetting,
    refuseSetting,
    arriveSetting,
    serviceNumberSetting
} from "./../../../menu/permission.js";

export default {
    data() {
        let settingType = [
            {
                label: "接单设置",
                value: "getOrderSetting",
                type: "ACCESS_ORDER",
                show: getOrderSetting
            },
            {
                label: "转单设置",
                value: "transOrderSetting",
                type: "TRANS_ORDER",
                show: transOrderSetting
            },
            {
                label: "异常处理设置",
                value: "errorDealSetting",
                type: "EXCEPTION_ORDER",
                show: errorDealSetting
            },
            {
                label: "拒单设置",
                value: "refuseSetting",
                type: "REFUSE_ORDER",
                show: refuseSetting
            },
            {
                label: "送达设置",
                value: "arriveSetting",
                type: "RIDER_ARRIVE",
                show: arriveSetting
            },
            {
                label: "客服电话设置",
                value: "serviceNumberSetting",
                type: "PLATFORM_CUSTOMER",
                show: serviceNumberSetting
            }
        ];
        return {
            settingType,
            keyTime: new Date().getTime()
        };
    },
    computed: {
        nowTab() {
            this.keyTime = new Date().getTime();
            return this.$route.path.replace("/", "");
        },
        settingList() {
            return this.settingType.filter(item => {
                if (item.show) {
                    return item;
                }
            });
        }
    },
    methods: {
        switchTab(tab, type) {
            this.$router.push({ name: tab });
        }
    }
};
</script>

