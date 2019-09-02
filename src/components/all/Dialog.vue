<template>
    <div class="dialog-container" v-if='open'>
        <div class="dialog">
            <div class="title">
                {{title}}
            </div>
            <div class="content">
                <div class="message">
                    {{message}}
                </div>
                <textarea class="message-input" cols="30" rows="10" :placeholder="placeholder" v-model='textareaInput'></textarea>
                <div class="btn-group">
                    <button @click='cancel'>取消</button>
                    <button @click="submit">确认</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: "提示"
        },
        message: {
            type: String,
            default: "请填写原因"
        },
        placeholder: {
            type: String,
            default: "请填写原因"
        }
    },
    data() {
        return {
            textareaInput: "",
            open: this.show
        };
    },
    watch: {
        show(val) {
            this.open = val;
        },
        open(val) {
            if (!val) {
                this.$emit("update:show", val);
            }
        }
    },
    methods: {
        cancel() {
            this.open = false;
        },
        submit() {
            this.$emit("submit", this.textareaInput);
            this.open = false;
        }
    }
};
</script>
<style lang="scss" scoped>
$title-color: red;
$title-height: 37px;
$btn-height: 37px;
$btn-bg-color: rgba(255, 0, 0, 0.5);
.dialog-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    .dialog {
        width: 300px;
        min-height: 300px;
        background: #fff;
        .title {
            height: $title-height;
            line-height: $title-height;
            text-align: center;
            color: #fff;
            background: $title-color;
        }
        .content {
            .message {
                text-align: center;
                line-height: 50px;
            }
            .message-input {
                display: block;
                padding: 5px;
                width: 85%;
                margin: 0 auto;
                border: 1px solid #999;
                border-radius: 7px;
            }
            .btn-group {
                height: 70px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                button {
                    width: 33%;
                    height: $btn-height;
                    line-height: $btn-height;
                    background: $btn-bg-color;
                    border: 0;
                    border-radius: 17px;
                    color: #fff;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
