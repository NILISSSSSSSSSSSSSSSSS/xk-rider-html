<template>
    <!-- <div class="province-cascader"> -->
    <el-cascader class=" input-250" @active-item-change="handleItemChange" @change="getValue" v-model="rigion"
        :disabled="disabled" :props="propsCascader" change-on-select size="small" :options="options"></el-cascader>
    <!-- </div> -->
</template>
<script>
let citys = "";
export default {
    props: {
        value: {},
        all: {
            type: Boolean,
            default: false
        },
        onlyRegion: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            propsCascader: {
                value: "code",
                label: "name",
                children: "cities"
            },
            rigion: "",
            options: [],
            index: 0, //省份索引
            subIndex: 0, //市索引,
            province: ""
        };
    },
    created() {
        localStorage.getItem("xk-all-address")
            ? this.getProvince()
            : this.cacheData();
        // if(this.value > 0){
        //     this.rigion = this.value
        // }else{
        //     this.rigion = this.onlyRegion;
        // }
        this.rigion = this.value;
    },
    methods: {
        cacheData() {
            let result = [];
            let city = new Map(JSON.parse(localStorage.getItem("xk-city")));
            let district = new Map(
                JSON.parse(localStorage.getItem("xk-district"))
            );
            city.forEach((item, code, array) => {
                let arr = {
                    cities: []
                };
                district.forEach((subItem, subCode, subArr) => {
                    if (subItem.parentCode == code) {
                        let obj = subItem;
                        obj.code = subCode;
                        obj.parentCode = code;
                        arr.cities.push(obj);
                    }
                });
                arr.code = code;
                arr.name = item.name;
                arr.parentCode = item.parentCode;
                result.push([code, arr]);
            });
            this.cacheProvince(result);
        },
        cacheProvince(params) {
            let cities = new Map(params);
            let result = [];
            let province = new Map(
                JSON.parse(localStorage.getItem("xk-province"))
            );
            province.forEach((item, code, array) => {
                let arr = {
                    cities: []
                };
                cities.forEach((subItem, subCode, subArr) => {
                    if (subItem.parentCode == code) {
                        let obj = subItem;
                        obj.code = subCode;
                        arr.cities.push(obj);
                    }
                });
                arr.code = code;
                arr.name = item.name;
                result.push(arr);
            });
            localStorage.setItem("xk-all-address", JSON.stringify(result));
            this.getProvince();
        },
        //获取省份
        getProvince() {
            this.options = JSON.parse(localStorage.getItem("xk-all-address"));
            if (this.all) {
                this.options.unshift({ code: "000000", name: "全国" });
            }
        },
        handleItemChange(val) {
            this.rigion = val;
        },
        getValue(val) {
            this.$emit("input", val);
        }
    },
    watch: {
        value(val, oldVal) {
            if (val !== oldVal) {
                this.rigion = val;
            }
        },
        onlyRegion(val) {
            this.rigion = val;
        }
    }
};
</script>