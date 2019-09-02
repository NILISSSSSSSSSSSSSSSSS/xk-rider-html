<template>
    <div class="area-rider-list rider-container">
        <div class="rider-switch">
            <div class="tab" :class="{active:tabName=='my'}" @click='switchTab("my")'>
                我的骑士
            </div>
            <!-- <div class="tab" :class="{active:tabName=='merchant'}" @click='switchTab("merchant")'>
                商户骑士
            </div> -->
        </div>
        <div class="rider-search">
            <el-form :inline="true" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label='骑士ID:'>
                            <el-input :size='$size' class="rider-input" v-model='formData.riderId' placeholder="请输入骑士ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='骑士姓名:'>
                            <el-input :size='$size' class="rider-input" v-model='formData.realName' placeholder="请输入骑士姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label='手机号码:'>
                            <el-input :size='$size' class="rider-input" v-model='formData.phone' placeholder="请输入骑士手机号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label='工作状态:'>
                            <el-select class="rider-input margin-right-20" :size='$size' v-model='formData.isAccessOrder'>
                                <el-option v-for='(item,index) in options' :key='index' :label='item.label' :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='8'>
                        <el-form-item label=' '>
                            <el-button :size='$size' class="rider-btn submit" @click='getList'>搜索</el-button>
                            <el-button :size='$size' class="rider-btn cancel" @click='reset'>重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row> 
            </el-form>
        </div>
        <div class="rider-table">
            <el-table :size='$size' :data='tableData' v-loading="loading" element-loading-background='rgba(0,0,0,0.8)'
                fit>
                <el-table-column label="序号" prop="" type='index' :index='function(index){return (formData.page-1)*formData.limit+index+1}'
                    width='100'></el-table-column>
                <el-table-column label="骑士ID" prop="id" min-width='140'></el-table-column>
                <el-table-column label="账号状态" prop="" min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.isFrozen?"已冻结":"已激活"}}
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" prop="phone" min-width='120'></el-table-column>
                <el-table-column label="工作状态" prop="" min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.isAccessOrder?"工作中":"休息中"}}
                    </template>
                </el-table-column>
                <el-table-column label="配送区域" prop="" min-width='190'>
                    <template slot-scope='scope'>
                        {{scope.row.provinceCode|getProvinceName}} {{scope.row.cityCode|getCityName}}
                        {{scope.row.districtCode|getDistrictName}}
                    </template>
                </el-table-column>
                <el-table-column label="实名认证" prop="" min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.idCardAuthStatus|AuthStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="健康证认证" prop="" min-width='100'>
                    <template slot-scope='scope'>
                        {{scope.row.healthCardAuthStatus|AuthStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="骑士姓名" prop="realName" min-width='140'></el-table-column>
                <el-table-column label="区域负责人" prop="partnerName" min-width='120'></el-table-column>
                <el-table-column label="基本资料" prop="" min-width='100'>
                    <template slot-scope='scope'>
                        <el-button :size='$size' type='primary' @click='openRiderInfo(scope.row)'>查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="订单列表" prop="" min-width='100'>
                    <template slot-scope='scope'>
                        <el-button :size='$size' type='primary' @click='toOrderList(scope.row)'>查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :form='formData' :total='total' @page='getPage'></Pagination>
        <user-info :show.sync='openInfo' :uid='uid'></user-info>
    </div>
</template>
<script>
import UserInfo from "./../../../components/user/UserInfoDisplay";
export default {
    components: {
        UserInfo
    },
    data() {
        let options = [
            { label: "全部", value: "" },
            { label: "工作中", value: "1" },
            { label: "休息中", value: "0" }
        ];
        return {
            options,
            tabName: "my",
            tableData: [],
            total: 0,
            loading: false,
            formData: {
                phone: "",
                realName: "",
                riderId: "",
                isAccessOrder: "",
                page: 1,
                limit: 10
            },
            openInfo: false,
            uid: ""
        };
    },
    methods: {
        switchTab(name) {
            this.tabName = name;
            this.getList();
        },
        getList() {
            this.loading = true;
            let api = this.$api.operationAreaRider;
            if (this.tabName == "merchant") {
                api = this.$api.operationAreaMerchantRider;
            }
            this.$http
                .get(api, this.formData, true)
                .then(res => {
                    console.log("​getList -> res", res);
                    this.tableData = res.data;
                    this.total = res.total;
                    this.loading = false;
                })
                .catch(err => {
                    console.log("​getList -> err", err);
                    this.$message.error("暂时无法获取 错误码:" + err.code);
                    this.tableData = [];
                    this.total = 0;
                    this.loading = false;
                });
        },
        getPage(val) {
            console.log(val.limit, val.page, val.form);
            this.formData = { ...val.form, limit: val.limit, page: val.page };
            this.getList();
        },
        reset() {
            this.formData = {
                phone: "",
                realName: "",
                riderId: "",
                isAccessOrder: "",
                page: 1,
                limit: 10
            };
            this.getList();
        },
        openRiderInfo(rider) {
            this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
            });
            this.uid = rider.id;
            this.openInfo = true;
        },
        toOrderList(rider) {
            let rid = rider.id;
            let rName = rider.realName;
            this.$router.push({
                name: "orderList",
                query: { id: rid, name: rName }
            });
        }
    }
};
</script>
