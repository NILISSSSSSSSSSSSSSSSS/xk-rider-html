/**
 * 全局异常处理
 * @param err
 * @param vm
 * @param info
 */
export function errorHandler(err, vm, info) {
    console.error("configError", err)
    console.error("configErrorVm", vm)
    console.error("configErrorInfo", info)
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
}