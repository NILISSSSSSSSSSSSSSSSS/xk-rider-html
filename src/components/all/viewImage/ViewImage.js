// import Vue from 'vue';
import View from './ViewImage.vue';

const MessageDialog = Vue.extend(View);
let md;
const InitInstance = function(url) {
    if(md) {
        md.picUrl = url;
        md.visible = true;
        return false;
    }
    md = new MessageDialog({
        el: document.createElement('div')
    })
    md.picUrl = url;
    document.body.appendChild(md.$el);
    Vue.nextTick(() => {
        md.visible = true;
    });
}

const view = function(url) {
    InitInstance(url);
}

export default view;