<style lang="scss" scoped src='./addUserGroup.scss'></style>
<template>
    <div class="add-user-group">
        <el-form label-width='120px'>
            <el-form-item label='名称:'>
                <el-input :size='$size'></el-input>
            </el-form-item>
            <el-form-item label='名称:'>
                <el-input
                    :size='$size'
                    :autosize="{minRows:2}"
                    type='textarea'
                ></el-input>
            </el-form-item>
            <el-form-item label='选择用户组成员:'>
                <el-button
                    :size='$size'
                    type='primary'
                >
                    <router-link to='/chooseGroupUser'>选择</router-link>
                </el-button>
            </el-form-item>
        </el-form>
        <div class="user-container">
            <div class="num">
                <span>成员名单</span>
                <span>已选{{people.length}}人</span>
            </div>
            <div class="people">
                <span
                    v-for='(item,index) in people'
                    :key='index'
                    @click="removeName(index)"
                >{{item}}</span>
            </div>
            <div class="tips">
                注：姓名可以删除
            </div>
        </div>
        <el-button
            :size='$size'
            type='primary'
        >确定</el-button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            people: [
                "姓名1",
                "姓名2",
                "姓名3",
                "姓名4",
                "姓名5",
                "姓名6",
                "姓名7"
            ]
        };
    },
    created() {
        console.log("接受参数", this.$route.params);
    },
    methods: {
        removeName(index) {
            this.people.splice(index, 1);
            console.log(arr);
        }
    }
};
</script>


