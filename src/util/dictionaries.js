import axios from '../axios/index'
import api from '../service/index'
import {
    Message
} from 'element-ui'
import {
    getSession
} from './publicMehotds'

///临时清除省市区
export function checkUpdate() {
    if (localStorage.getItem('updated')) {
        return false;
    }
    localStorage.setItem('updated', 1);
    localStorage.setItem("provinceVersion", JSON.stringify(""));
    localStorage.setItem("cityVersion", JSON.stringify(""));
    localStorage.setItem("districtVersion", JSON.stringify(""));
    localStorage.removeItem("xk-all-address");
}

export function getProvince() {
    let version = JSON.parse(localStorage.getItem("provinceVersion"));
    axios.get(api.regionPage, {
            level: 1,
            v: version ? version : "",
            limit: 0,
            page: 1
        }, true)
        .then(res => {
            if (res) {
                localStorage.setItem("provinceVersion", res.v);
                let arr = [];
                for (let item of res.data) {
                    arr.push([item.code, {
                        id: item.id,
                        name: item.name
                    }])
                }
                localStorage.setItem("xk-province", JSON.stringify(arr))
            }
        })
        .catch(err => {
            console.log('​getProvince -> err', err);
            Message.error("省份列表获取失败");
        })
}

function getAllCityList() {
    let version = JSON.parse(localStorage.getItem("cityVersion"));
    axios.get(api.regionPage, {
            level: 2,
            v: version ? version : "",
            limit: 0,
            page: 1
        }, true)
        .then(res => {
            if (res) {
                localStorage.setItem("cityVersion", res.v);
                let arr = [];
                for (let item of res.data) {
                    arr.push([item.code, {
                        id: item.id,
                        name: item.name,
                        parentCode: item.parentCode
                    }])
                }
                localStorage.setItem('xk-city', JSON.stringify(arr))
            }
        }).catch(err => {
            Message.error("城市列表获取失败")
        })
}

//获取所有区县
function getDistrictCacheList() {
    let version = JSON.parse(localStorage.getItem("districtVersion"));
    axios.get(api.regionPage, {
        level: 3,
        v: version ? version : "",
        limit: 0,
        page: 1
    }, true).then(res => {
        if (res) {
            localStorage.setItem("districtVersion", res.v);
            let arr = [];
            for (let item of res.data) {
                arr.push([item.code, {
                    id: item.id,
                    name: item.name,
                    parentCode: item.parentCode
                }])
            }
            localStorage.setItem('xk-district', JSON.stringify(arr));
        }
    }).catch(err => {
        Message.error("区县列表获取失败")
    })
}

function XKModule() {
    let data = [{
        label: '全部',
        value: ''
    }, {
        label: '自营类',
        value: 'mall'
    }, {
        label: '外卖类',
        value: 'shop'
    }]
    localStorage.setItem("XKModule", JSON.stringify(data))
}

function authStatus() {
    let data = [{
            label: "",
            value: "全部"
        },
        {
            label: "SUBMIT",
            value: "待审核"
        },
        {
            label: "SUCCESS",
            value: "已通过"
        },
        {
            label: "FAILED",
            value: "未通过"
        }
    ]
    localStorage.setItem("authStatus", JSON.stringify(data))
}

function orderType() {
    let data = [{
        label: '全部',
        value: ''
    }, {
        label: '食品类',
        value: 'food'
    }, {
        label: '非食品类',
        value: 'not_food'
    }]
    localStorage.setItem('orderType', JSON.stringify(data))
}

// 等待骑手接单	wait_rider
// 等待骑手取货(已接单)	wait_pickup
// 骑手配送中(确认到店取货)	rider_drivering
// 拒单(取货后子订单状态)	rider_refuse
// 转单(面对面转单子订单状态)	rider_trans
// 骑手到达目的地(订单已完成)	rider_arraive
// 用户收货	user_confirm
function orderStatus() {
    let data = [{
        label: '全部',
        value: ''
    }, {
        label: '待接单',
        value: 'wait_rider'
    }, {
        label: '待取货',
        value: 'wait_pickup'
    }, {
        label: '配送中',
        value: 'rider_drivering'
    }, {
        label: '拒单',
        value: 'rider_refuse'
    }, {
        label: '转单',
        value: 'rider_trans'
    }, {
        label: '转单中',
        value: 'rider_transing'
    }, {
        label: '已取消',
        value: 'order_cancel'
    }, {
        label: '取消中',
        value: 'order_canceling'
    }, {
        label: '已完成',
        value: 'rider_arraive'
    }, {
        label: '已收货',
        value: 'user_confirm'
    }];
    localStorage.setItem("orderStatus", JSON.stringify(data))
}
/**
 * 需要登录后初始化的内容
 */
export function loginInit() {
    checkUpdate(); //临时使用
    getProvince();
    getAllCityList();
    getDistrictCacheList();
}

// let user = getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {};

// if (user.token) {
//     loginInit();
// }
{
    orderType();
    orderStatus();
    XKModule();
    authStatus();
}