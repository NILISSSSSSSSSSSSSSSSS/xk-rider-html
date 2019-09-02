/**
 * Created by choizhang on 2018/1/31.
 */
// import Vue from 'vue';
import Moment from "moment";
// import Axios from 'axios';

Vue.filter("formatTime", (time, type) => {
    if (!time) {
        return "暂无";
    }
    time = Number(time) < 10000000000 ? time * 1000 : time;
    if (type) {
        return Moment(time).format(type);
    } else {
        return Moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
});

Vue.filter("formatSize", bytes => {
    if (bytes === 0) return "0 B";
    var k = 1000, // or 1024
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
});

Vue.filter("decodeURI", url => {
    if (url) {
        return decodeURIComponent(url);
    }
    return "";
});

Vue.filter("formatPrice", value => {
    if (value) {
        return (Number(value) / 100).toFixed(2);
    } else {
        return "0.00";
    }
});

// Vue.filter('viewerType', (type) => {
//     switch (type) {
//         case 'PERSONAL_VIRTUAL_MERCHANT':
//             return "个体虚拟商户";
//         case 'NORMAL_USER':
//             return "普通用户";
//         case 'REAL_MERCHANT':
//             return "实体商户";
//         case 'CITY_PARTNER':
//             return "城市合伙人";
//         case 'ANCHOR_VIRTUAL_MERCHANT':
//             return "主播虚拟商户";
//         case 'ECONOMIC_COMPANY':
//             return "经济公司";
//         default:
//             break;
//     }
// })

// Vue.filter('bannerModule', (type) => {
//     switch (type) {
//         case 'XKSQUARE':
//             return "晓可广场";
//         case 'BUSINESS_AREA':
//             return "商圈首页";
//         case 'WELFARE':
//             return "福利商城首页";
//         case 'SELF_SHOP':
//             return "自营商城首页";
//         case 'ALLIANCE':
//             return "晓可联盟首页";
//         case 'LIVE_VIDEO':
//             return "晓可直播首页";
//         default:
//             break;
//     }
// })

// Vue.filter('templateName', (type) => {
//     switch (type) {
//         case 'TMP_ONE':
//             return "模板一";
//         case 'TMP_TWO':
//             return "模板二";
//         case 'TMP_THREE':
//             return "模板三";
//         case 'TMP_FOUR':
//             return "模板四";
//         case 'TMP_FIVE':
//             return "模板五";
//         default:
//             break;
//     }
// })

// Vue.filter('msgType', (type) => {
//     switch (type) {
//         case 0:
//             return "文本消息";
//         case 1:
//             return "文本消息";
//         case 2:
//             return "图片消息";
//         case 3:
//             return "语音消息";
//         case 14:
//             return "知识点消息";
//         case 13:
//             return "订单消息";
//         case 100:
//             return "自定义消息";
//         default:
//             break;
//     }
// })

// Vue.filter('WorkStatus', (type) => {
//     switch (type) {
//         case 'finish':
//             return "已完成";
//         case 'not_receipt':
//             return "未接单";
//         case 'receipt':
//             return "已接单";
//         case 'evaluate':
//             return "已评价";
//         default:
//             break;
//     }
// })

// Vue.filter('UserType', (type) => {
//     switch (type) {
//         case 'user':
//             return "小可用户";
//         case 'muser':
//             return "商户用户";
//         case 'anchor':
//             return "主播";
//         default:
//             break;
//     }
// })

// Vue.filter('MerchantType', (type) => {
//     switch (type) {
//         case 'EXTENSION_WORKER':
//             return "个人";
//         case 'ZHUBO':
//             return "主播";
//         case 'MERCHANT':
//             return "商户";
//         case 'PARTNER':
//             return "合伙人";
//         case 'BROKERAGE_FIRM':
//             return "经济公司";
//         default:
//             break;
//     }
// })

Vue.filter("getCityName", code => {
    let city = new Map(JSON.parse(localStorage.getItem("xk-city")));
    // return city.get(code).name
    if (city.get(code)) {
        return city.get(code).name;
    } else {
        return "暂无";
    }
});
Vue.filter("getProvinceName", code => {
    let province = new Map(JSON.parse(localStorage.getItem("xk-province")));
    // return city.get(code).name
    if (province.get(code)) {
        return province.get(code).name;
    } else {
        return "暂无";
    }
});
Vue.filter("getDistrictName", code => {
    let district = new Map(JSON.parse(localStorage.getItem("xk-district")));
    // return city.get(code).name
    if (district.get(code)) {
        return district.get(code).name;
    } else {
        return "暂无";
    }
});
Vue.filter("AuthStatus", status => {
    switch (status) {
        case "SUBMIT":
            return "未审核";
        case "SUCCESS":
            return "已通过";
        case "FAILED":
            return "未通过";
        default:
            return "暂无";
    }
});
Vue.filter("OrderStatus", status => {
    let OrderStatus = [
        {
            label: "全部",
            value: ""
        },
        {
            label: "待接单",
            value: "wait_rider"
        },
        {
            label: "待取货",
            value: "wait_pickup"
        },
        {
            label: "配送中",
            value: "rider_drivering"
        },
        {
            label: "拒单",
            value: "rider_refuse"
        },
        {
            label: "已转单",
            value: "rider_trans"
        },
        {
            label: "转单中",
            value: "rider_transing"
        },
        {
            label: "已完成",
            value: "rider_arraive"
        },
        {
            label: "订单已取消",
            value: "order_cancel"
        },
        {
            label: "订单取消中",
            value: "order_canceling"
        },
        {
            label: "已收货",
            value: "user_confirm"
        }
    ];
    for (let i of OrderStatus) {
        if (i.value == status) {
            return i.label;
        }
    }
    return "暂无";
});

Vue.filter("formatVersion", version => {
    if (!version) return "暂无";
    let arr = (version + "").split("");
    let l = arr.length;
    if (l == 5) {
        let v1 = arr[0] - 0;
        let v2 = `${arr[1]}${arr[2]}` - 0;
        let v3 = `${arr[3]}${arr[4]}` - 0;
        return `${v1}.${v2}.${v3}`;
    }
    if (l == 6) {
        let v1 = `${arr[0]}${arr[1]}` - 0;
        let v2 = `${arr[2]}${arr[3]}` - 0;
        let v3 = `${arr[4]}${arr[5]}` - 0;
        return `${v1}.${v2}.${v3}`;
    }
});
