<template>
    <!-- 图片查看 -->
    <div v-if="visible" title="预览图片" class="prviewPic" @click.self='close' @mousewheel.native='wheel' @mousemove='move'
        @mouseup='end'>
        <img v-if="picUrl.split('?')[1]!='video'" :src="picUrl" alt="" class="preview-pic" :style='{transform:`translate(${X}px,${Y}px) scale(${scale}) ${isRotate?"rotateY(180deg)":""}`}'
            @mousedown="start" draggable="false">
        <video v-else :src="picUrl"></video>
        <span class="rotate-btn" @click.stop="isRotate=!isRotate">点击水平翻转图片</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            picUrl: "",
            visible: false,
            scale: 1,
            isRotate: false,
            startX: null,
            startY: null,
            nowX: 0,
            nowY: 0,
            X: 0,
            Y: 0,
            moveLock: false
        };
    },
    mounted() {
        window.addEventListener("mousewheel", this.wheel, false);
        // firefox IE
        window.addEventListener("DOMMouseScroll", this.wheel, false);
    },
    watch: {
        visible(val) {
            !val ? (this.picUrl = "") : null;
        }
    },
    methods: {
        close() {
            this.visible = false;
            this.picUrl = "";
            this.scale = 1;
            this.nowX = 0;
            this.nowY = 0;
            this.X = 0;
            this.Y = 0;
        },
        wheel(val) {
            val.preventDefault();
            let y = val.deltaY;
            if (!y) {
                y = val.detail; //firefox
            }
            if (!y) {
                y = -val.wheelDelta; //IE
            }
            if (y > 0) {
                let size = this.scale - 0.05;
                if (size < 0.5) return;
                this.scale = size;
            } else {
                let size = this.scale + 0.05;
                if (size > 1.5) return;
                this.scale = size;
            }
        },
        start(e) {
            console.log("TCL: start -> e", e);
            e.preventDefault();
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.moveLock = true;
            // document.addEventListener("mousemove", this.move, false);
        },
        move(e) {
            e.preventDefault();
            if (!this.moveLock) return;
            let moveX = e.clientX - this.startX;
            let moveY = e.clientY - this.startY;
            if (parseInt(moveX) == moveX && parseInt(moveY) == moveY) {
                this.X = this.nowX + moveX;
                this.Y = this.nowY + moveY;
            }
        },
        end(e) {
            e.preventDefault();
            if (!this.moveLock) return;
            this.moveLock = false;
            let moveX = e.clientX - this.startX;
            let moveY = e.clientY - this.startY;
            this.nowX = this.nowX + moveX;
            this.nowY = this.nowY + moveY;
            // document.removeEventListener("mousemove", this.move, false);
        }
    }
};
</script>
<style scoped lang="scss">
// .view-image {
.prviewPic {
    text-align: center;
    width: 100%;
    max-height: 100vh;
    // overflow:auto;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    img {
        max-width: 100%;
        max-height: 100%;
        // position: absolute;
        // top: 50%;
        // left: 50%;
        // transition: all 0.1s linear;
    }
    video {
        max-width: 100%;
    }
}
.rotate-btn {
    position: fixed;
    top: 50px;
    right: 100px;
    z-index: 11000;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
}
.rotate-img {
    transform: rotateY(180deg);
}
</style>
