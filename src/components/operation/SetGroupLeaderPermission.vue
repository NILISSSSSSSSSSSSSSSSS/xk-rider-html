<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="open" title='组长权限' v-if='permissions.length>0'>
        <div class='checkbox-item' v-for='(item,index) in permissions' :key='index'>
            <el-checkbox @mousedown.native='nowIndex={index}' @change='handleAllChange' v-model="checkAll[index]">{{item.name}}</el-checkbox>
            <div class="line-flex-start" v-for='(subitem,subindex) in item.resources' :key='subindex' @mousedown='nowIndex={index,subindex}'>
                <el-checkbox border :indeterminate="checkedAllStatus['p'+index+subindex].status" v-model="checkedAllStatus['p'+index+subindex].check"
                    @change='handleSubChange'>{{subitem.name}}</el-checkbox>
                <el-checkbox-group v-model='checkedList["p"+index+subindex]' @change="handleCheckedChange">
                    <el-checkbox :size='$size' border v-for='ssitem in subitem.resources' :label="ssitem.service" :key='ssitem.service'>{{ssitem.name}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="footer" slot='footer'>
            <el-button :size='$size' @click='open=false'>取消</el-button>
            <el-button :size='$size' type='primary' @click='setPermission'>确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean
        },
        gid: {
            type: [String, Number]
        },
        service: {
            type: Array
        }
    },
    data() {
        return {
            open: this.show,
            permissions: [],
            checkAll: [],
            checkedAllStatus: {},
            checkedList: {}
        };
    },
    computed: {
        mCheckedList() {
            let arr = [];
            let list = this.checkedList;
            for (let i1 in list) {
                if (list.hasOwnProperty(i1)) {
                    let item = list[i1];
                    for (let i2 = 0, l2 = item.length; i2 < l2; i2++) {
                        arr.push(item[i2]);
                    }
                }
            }
            return arr;
        }
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            if (val) {
                this.getResourceList();
            }
            this.$emit("update:show", val);
        }
    },
    methods: {
        // 全部
        handleAllChange(val) {
            let { index } = this.nowIndex;
            let item1 = this.permissions[index].resources;
            if (val) {
                for (let i = 0, ll = item1.length; i < ll; i++) {
                    let item2 = item1[i].resources;
                    let arr = [];
                    for (let j = 0, lll = item2.length; j < lll; j++) {
                        let item3 = item2[j];
                        arr.push(item3.service);
                    }
                    this.checkedList["p" + index + i] = arr;
                    this.checkedAllStatus["p" + index + i].status = false;
                    this.checkedAllStatus["p" + index + i].check = true;
                }
            } else {
                for (let i = 0, ll = item1.length; i < ll; i++) {
                    let item2 = item1[i].resources;
                    let arr = [];
                    this.checkedList["p" + index + i] = arr;
                    this.checkedAllStatus["p" + index + i].status = false;
                    this.checkedAllStatus["p" + index + i].check = false;
                }
            }
        },
        // 二级选项
        handleSubChange(val) {
            let { index, subindex } = this.nowIndex;
            let item = this.permissions[index].resources[subindex].resources;
            let arr = [];
            for (let i = 0, l = item.length; i < l; i++) {
                let service = item[i].service;
                arr.push(service);
            }
            this.checkedList["p" + index + subindex] = val ? arr : [];
            this.checkedAllStatus["p" + index + subindex].status = false;
            this.checkCheckAll();
        },
        // 子选项
        handleCheckedChange(value) {
            let { index, subindex } = this.nowIndex;
            let checkedCount = value.length;

            this.checkedAllStatus["p" + index + subindex].check =
                checkedCount ===
                this.permissions[index].resources[subindex].resources.length;

            this.checkedAllStatus["p" + index + subindex].status =
                checkedCount > 0 &&
                checkedCount <
                    this.permissions[index].resources[subindex].resources
                        .length;
            this.checkCheckAll();
        },
        // 验证是否全选
        checkCheckAll() {
            let length = this.permissions.length;
            let status = false;
            for (let key in this.checkedAllStatus) {
                let index = key[1];
                let subindex = key[2];
                if (this.checkedAllStatus[key].check) {
                    status = true;
                }
                if (!this.checkedAllStatus[key].check) {
                    status = false;
                }
                this.checkAll[index] = status;
            }
            // this.closeLoading();
        },
        // 更新或者新建是否checked列表
        createCheckedList(list) {
            this.checkedList = {};
            let obj = {};
            let obj2 = {};
            for (let i = 0, l = list.length; i < l; i++) {
                let subitem = list[i].resources;
                for (let j = 0, x = subitem.length; j < x; j++) {
                    obj["p" + i + j] = [];
                    obj2["p" + i + j] = { check: false, status: false };
                }
            }
            this.checkedList = obj;
            this.checkedAllStatus = obj2;
            this.findServices();
        },
        // 获取资源列表
        getResourceList() {
            this.$http
                .get(this.$api.permissionResourceList, {}, true)
                .then(res => {
                    console.log("​getResourceList -> res", res);
                    this.permissions = res.partnerResource;
                    this.createCheckedList(this.permissions);
                })
                .catch(err => {
                    this.$message.error("无法获取资源列表");
                    // this.closeLoading();
                });
        },
        // 找到当前角色的权限
        findServices() {
            let permission = this.permissions;
            let services = this.service || [];
            for (let i1 = 0, l1 = permission.length; i1 < l1; i1++) {
                let item1 = permission[i1].resources;
                for (let i2 = 0, l2 = item1.length; i2 < l2; i2++) {
                    let item2 = item1[i2].resources;
                    for (let i3 = 0, l3 = item2.length; i3 < l3; i3++) {
                        let item3 = item2[i3].service;
                        if (services.includes(item3)) {
                            this.checkedList["p" + i1 + i2].push(item3);
                        }
                    }
                    this.findCheckStatus(i1, i2);
                }
            }
            this.checkCheckAll();
        },
        // 找到当前角色的权限状态，全选等等
        findCheckStatus(i1, i2) {
            let checkLength = this.checkedList["p" + i1 + i2].length;
            this.checkedAllStatus["p" + i1 + i2].check =
                checkLength ===
                this.permissions[i1].resources[i2].resources.length;
            this.checkedAllStatus["p" + i1 + i2].status =
                checkLength > 0 &&
                checkLength <
                    this.permissions[i1].resources[i2].resources.length;
        },
        setPermission() {
            let data = {
                captainId: this.gid,
                services: this.mCheckedList
            };
            this.$http
                .post(this.$api.operationSetGroupPermission, data, true)
                .then(res => {
                    this.$notify.success({
                        title: "提示",
                        message: `成功`
                    });
                    this.$emit("success");
                    this.open = false;
                    console.log("​setPermission -> res", res);
                })
                .catch(err => {
                    this.$notify.warning({
                        title: "提示",
                        message: `失败`
                    });
                    console.log("​setPermission -> err", err);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.line-flex-start {
    padding: 20px 25px 10px;
    .el-checkbox-group {
        margin-left: 20px;
    }
}
.checkbox-item {
    margin-top: 25px;
}
</style>

