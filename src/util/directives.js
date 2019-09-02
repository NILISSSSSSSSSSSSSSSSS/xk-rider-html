import {
    getPermission,
    getSession
} from "./publicMehotds"

// 预加载
// Vue.directive("preload", function (el, binding) {
//     let img = new Image();
//     img.src = binding.value.src;
//     img.style = 'min-width: 160px;max-width: 180px;';
//     img.onclick = function () {
//         Vue.prototype.$viewImage(binding.value)
//     }
//     img.onload = function () {
//         el.appendChild(img)
//     }
// })

//权限-隐藏相关元素
Vue.directive("permission", function (el, binding, vnode) {
    console.log("TCL: vnode", vnode)
    let user = getSession("xk-role") ? JSON.parse(getSession("xk-role")) : [];
    if (user[0] == 'riderCreate') {
        return;
    }
    if (!getPermission(binding.value)) {
        el.parentNode.removeChild(el);
    }
})