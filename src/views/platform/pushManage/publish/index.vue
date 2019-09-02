<style lang="scss" scoped></style>
<template>
    <div class="publish">
        <el-form :model="formData" label-width="100px">
            <el-form-item label='用户:'>
                <el-select :size='$size' v-model='chooseUser'>
                    <el-option v-for='(item,index) in user' :value='item.label' :key='index' :label='item.label'></el-option>
                </el-select>
                <el-button :size='$size' @click='toAdd'>创建内容用户组</el-button>
            </el-form-item>
            <el-form-item label='标题:'>
                <el-input :size='$size'></el-input>
            </el-form-item>
            <el-form-item label='类型:'>
                <el-select :size='$size' v-model='chooseType'>
                    <el-option v-for='(item,index) in type' :value='item.label' :key='index' :label='item.label'></el-option>
                </el-select>
                <el-button :size='$size' @click='dialogFormVisible=true'>创建类型</el-button>
            </el-form-item>
            <el-form-item label='时间:'>
                <el-date-picker v-model="formData.time" type="datetimerange" :picker-options="pickerOptions2"
                    range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" align="right" :size='$size'>
                </el-date-picker>
            </el-form-item>
            <el-form-item label='内容:'>
                <el-input type='textarea' :autosize="{ minRows: 2}" :size='$size'></el-input>
            </el-form-item>
            <el-form-item label='添加H5外链:'>
                <el-input :size='$size'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' :size='$size'>确定</el-button>
                <el-button :size='$size' @click='back'>返回</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title='创建类型' :visible.sync="dialogFormVisible">
            <el-form label-width="100px">
                <el-form-item label='类型名称:'>
                    <el-input :size='$size'></el-input>
                </el-form-item>
            </el-form>
            <div slot='footer' class="btn-group">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
let user = [
    { label: 11 },
    { label: 22 },
    { label: 33 },
    { label: 44 },
    { label: 55 }
];
let type = [
    { label: 11 },
    { label: 22 },
    { label: 33 },
    { label: 44 },
    { label: 55 }
];
import { datePickerOption } from "./../../../../util/publicParams.js";
export default {
    data() {
        return {
            user,
            type,
            chooseUser: "",
            chooseType: "",
            formData: {
                time: ""
            },
            dialogFormVisible: false,
            pickerOptions2: datePickerOption
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        toAdd() {
            this.$router.push({ name: "addUserGroup" });
        }
    }
};
</script>

