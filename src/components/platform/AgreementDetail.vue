<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="open" width='450px' :title='form.title' top='5vh'>
        <div class="line-space-around margin-bottom-20">
            <div>预览宽度:</div>
            <el-radio-group class="radio-group" size='mini' v-model="editorWidth">
                <el-radio-button v-model='editorWidth' v-for='item in widthList' :key='item.value' :label='item.value'>{{item.name}}</el-radio-button>
            </el-radio-group>
        </div>
        <div class="ql-editor" :style='{width:editorWidth+"px"}' style='transition:all .5s linear' v-html='form.content'></div>
        <div slot='footer'>
            <el-button :size="$size" type='primary' @click='open=false'>确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
// import "quill/dist/quill.core.css";
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        form: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        let widthList = [
            { value: 320, name: "iPhone5s" },
            { value: 375, name: "iPhone7" },
            { value: 414, name: "iPhone7 plus" },
            { value: 360, name: "Android" }
        ];
        return {
            widthList,
            editorWidth: 375,
            open: this.show
        };
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            this.$emit("update:show", val);
        }
    }
};
</script>
<style lang="scss" scoped>
.radio-group {
    text-align: center;
}
.ql-editor {
    max-height: 60vh;
    overflow: auto;
    // max-width: 375px;
    margin: 0 auto;
}
</style>


