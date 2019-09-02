<template>
    <div class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult">
        </el-amap-search-box>
        <el-amap vid="amapDemo" :center='mapCenter' :zoom="13" class="amap-demo" :plugin='plugin' :events='clickLocation'>
            <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events='marker.events' :key='index'>
            </el-amap-marker>
            <el-amap-info-window v-if="window" :autoMove='true' :position="window.position" :visible="window.visible"
                :content="window.content">
            </el-amap-info-window>
        </el-amap>
        <el-button class="map-back" :size='$size' type='info' @click='backToWelcome()'>返回首页</el-button>
    </div>
</template>

<script>
import { amapKey } from "./../util/publicParams.js";
import { getSession } from "./../util/publicMehotds.js";
import VueAMap from "vue-amap";
// Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: amapKey,
    plugin: ["AMap.Geolocation", "AMap.Scale", "AMap.ToolBar", "AMap.Geocoder"],
    // 默认高德 sdk 版本为 1.4.4
    v: "1.4.4"
});
export default {
    data() {
        let self = this;
        return {
            user: getSession("xk-user")
                ? JSON.parse(getSession("xk-user"))
                : {},
            markers: [],
            searchOption: {
                city: "成都",
                citylimit: false
            },
            city: null,
            district: null,
            province: null,
            mapCenter: [104.071468, 30.561252],
            window: "",
            // 点击地图的option
            clickLocation: {
                click(e) {
                    let { lng, lat } = e.lnglat;
                    self.lng = lng;
                    self.lat = lat;
                    self.setOneMarker({ lng, lat });
                    self.geocoder({ lng, lat });
                }
            },
            // vue-amap的插件,需要在main.js中引用
            plugin: [
                {
                    pName: "Geolocation", //定位
                    buttonPosition: "RB",
                    zoomToAccuracy: true,
                    // enableHighAccuracy: true,
                    events: {
                        init(o) {
                            console.log("TCL: init -> o", o);
                            // o 是高德地图定位插件实例 ,
                            // chrome有坑,经常无法定位,
                            // firefox,edge.ie11正常,
                            // 浏览器多是通过ip地址定位
                            o.getCurrentPosition((status, result) => {
                                console.log("TCL: init -> result", result);
                                if (result && result.position) {
                                    self.mapCenter[0] = result.position.lng;
                                    self.mapCenter[1] = result.position.lat;
                                    self.lng = result.position.lng;
                                    self.lat = result.position.lat;
                                    self.center = [self.lng, self.lat];
                                    self.loaded = true;
                                    self.$nextTick();
                                }
                            });
                        }
                    }
                },
                {
                    pName: "Scale", //比例尺
                    events: {
                        init(instance) {
                            console.log("TCL: init -> instance", instance);
                        }
                    }
                },
                {
                    pName: "ToolBar", //工具条
                    events: {
                        init(instance) {
                            console.log("TCL: init -> instance", instance);
                        }
                    }
                }
            ]
        };
    },
    created() {
        this.getArea();
    },
    // mounted() {
    //     navigator.geolocation.getCurrentPosition(
    //         function(position) {
    //             console.log("TCL: mounted -> position", position);
    //         },
    //         function(error) {
    //             console.log("TCL: mounted -> error", error);
    //         }
    //     );
    // },
    methods: {
        // 从缓存获取省市区信息
        getArea() {
            let district = localStorage.getItem("xk-district");
            let province = localStorage.getItem("xk-province");
            let city = localStorage.getItem("xk-city");
            if (district && province && city) {
                this.district = JSON.parse(district);
                this.province = JSON.parse(province);
                this.city = JSON.parse(city);
            } else {
                this.$message.error("无地区code数据,请重新登录");
            }
        },
        // 高德根据经纬度查询的api
        geocoder({ lng, lat }) {
            let self = this;
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getAddress([lng, lat], function(status, result) {
                if (status === "complete" && result.info === "OK") {
                    if (result && result.regeocode) {
                        let address = result.regeocode.formattedAddress;
                        let districtName =
                            result.regeocode.addressComponent.district;
                        // self.$message.info(
                        //     [lng, lat] + " " + result.regeocode.formattedAddress
                        // );
                        self.openInfoWindow({
                            lng,
                            lat,
                            address,
                            districtName
                        });
                        self.$nextTick();
                    }
                }
            });
        },
        // 在地图上标一个点，先清空点
        setOneMarker({ lng, lat }) {
            let self = this;
            this.markers = [];
            let marker = {
                position: [lng, lat],
                events: {
                    click: e => {
                        let { lng, lat } = e.lnglat;
                        self.geocoder({ lng, lat });
                    }
                }
            };
            this.markers.push(marker);
        },
        // 根据区域名称查询省市区code,如果没有返回null
        getAreaCode(districtName) {
            let length = this.district.length;
            for (let i = 0; i < length; i++) {
                let one = this.district[i];
                if (one[1].name == districtName) {
                    let districtArr = [one[1].name, one[0]];
                    let cityArr = ["", one[1].parentCode];
                    let cityMap = new Map(this.city);
                    let provinceMap = new Map(this.province);
                    let cityInfo = cityMap.get(one[1].parentCode); //通过区的parentCode查询当前市的信息
                    cityArr[0] = cityInfo.name;
                    let provinceInfo = provinceMap.get(cityInfo.parentCode); //通过市的parentCode,查询省的信息
                    let provinceArr = [provinceInfo.name, cityInfo.parentCode];
                    return [provinceArr, cityArr, districtArr]; //[[name,code]]
                }
            }
            return null;
        },
        // 点击打开信息窗口(经纬度,地址名称,省市区code)
        openInfoWindow({ lng, lat, address, districtName }) {
            this.window = "";
            let area = this.getAreaCode(districtName);
            let areaInfo = "";
            if (area) {
                areaInfo = `
                <div>
                    <label>${area[0][0]} : </label>
                    <span>${area[0][1]}</span>
                </div>
                <div>
                    <label>${area[1][0]} : </label>
                    <span>${area[1][1]}</span>
                </div>
                <div>
                    <label>${area[2][0]} : </label>
                    <span>${area[2][1]}</span>
                </div>
                `;
            }
            let obj = {
                position: [lng, lat],
                content: `
                <div class="info-container">
                    <div>
                        <label>地址 : </label>
                        <span>${address}</span>
                    </div>
                    ${areaInfo}
                    <div>
                        <label>经度 : </label>
                        <span>${lng}</span>
                    </div>
                    <div>
                        <label>纬度 : </label>
                        <span>${lat}</span>
                    </div>
                    <div class="func"><strong>操作</strong></div>
                </div>
                `,
                visible: true
            };
            this.$nextTick(() => {
                this.window = obj;
                // 在更新页面之后再进行dom操作
                this.$nextTick(() => {
                    let doSome = document.querySelector(".func strong");
                    doSome.onclick = () => {
                        this.submit(area, [lng, lat], address);
                    };
                });
            });
        },
        // 点击获取当前点的位置之后的操作,输入公司名称并提交
        submit(area, location, companyAddress) {
            let districtCode = area[2][1];
            let cityCode = area[1][1];
            let provinceCode = area[0][1];
            let companyLocation = `${location[0]},${location[1]}`;
            if (
                districtCode &&
                cityCode &&
                provinceCode &&
                companyLocation &&
                companyAddress
            ) {
                this.$prompt("请输入公司名称", "提示", {
                    confirmButtonText: "提交",
                    cancelButtonText: "取消"
                })
                    .then(({ value }) => {
                        let companyName = value;
                        this.$http
                            .post(
                                this.$api.uploadLocation,
                                {
                                    districtCode,
                                    cityCode,
                                    provinceCode,
                                    companyLocation,
                                    companyAddress,
                                    companyName
                                },
                                true
                            )
                            .then(res => {
                                this.$message.success("提交成功");
                            })
                            .catch(err => {
                                this.$message.error("提交失败");
                            });
                    })
                    .catch(err => {
                        this.$message.info("取消输入");
                    });
            } else {
                this.$message.error("信息不全,请刷新页面");
            }
        },
        // 搜索
        onSearchResult(pois) {
            let self = this;
            this.markers = [];
            let latSum = 0;
            let lngSum = 0;
            if (pois.length > 0) {
                pois.forEach(poi => {
                    let { lng, lat } = poi;
                    lngSum += lng;
                    latSum += lat;
                    this.markers.push({
                        position: [poi.lng, poi.lat],
                        events: {
                            click: e => {
                                let { lng, lat } = e.lnglat;
                                self.geocoder({ lng, lat });
                            }
                        }
                    });
                });
                let center = {
                    lng: lngSum / pois.length,
                    lat: latSum / pois.length
                };
                this.mapCenter = [center.lng, center.lat];
            }
        },
        // 返回首页
        backToWelcome() {
            if (this.user.role[0].roleType == "SYSTEM") {
                this.$router.replace("/areaHomePage");
            } else {
                this.$router.replace("/welcome");
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.amap-demo {
    height: 100vh;
}
.search-box {
    position: absolute;
    top: 25px;
    right: 50px;
    // transform: translateX(-50%);
}
.amap-page-container {
    position: relative;
}
// /deep/ .amap-geo {
//     transform: translate(0px, -50px);
// }
/deep/ .info-container {
    padding: 10px;
    line-height: 30px;
    > div:not(:last-child) {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        font-size: 14px;
        span {
            flex: 1;
            padding-left: 10px;
        }
    }
    label {
        display: block;
        width: 75px;
        text-align: right;
        font-weight: bold;
    }
}
/deep/ .amap-marker-content {
    transform: scale(1.5);
}
/deep/ .amap-info-close {
    transform: scale(1.5);
}
/deep/ .amap-toolbar {
    transform: translate(0px, 100px);
}
/deep/ .func {
    text-align: right;
    strong {
        padding: 5px 10px;
        border: 1px solid #999;
        border-radius: 5px;
        font-size: 20px;
        cursor: pointer;
        &:hover {
            opacity: 0.7;
        }
        &:active {
            opacity: 0.5;
        }
    }
}
.map-back {
    position: absolute;
    left: 20px;
    top: 37px;
    z-index: 1000;
}
</style>
