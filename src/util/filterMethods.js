/**
 * @description: 格式化数字*100,1元=>100分
 * @param {num}
 * @return:num*100
 */
export function format1To100(num) {
    return num * 100;
}

/**
 * @description:格式化数字/100,100分=>1元
 * @param {num}
 * @return:num/100
 */
export function format100To1(num) {
    return num / 100;
}

/**
 * @description:格式化数字/1000,m=>km
 * @param {num}
 * @return:num/1000
 */
export function format1000To1(num) {
    return num / 1000;
}

/**
 * @description: 格式化数字*1000,km=>m
 * @param {num}
 * @return:num*1000
 */
export function format1To1000(num) {
    return num * 1000;
}

/**
 * @description:格式化%  1=>1%
 * @param {num}
 * @return:num/100
 */
export function formatToPercent(num) {
    return num / 100;
}

/**
 * @description: 格式化到秒数
 * @param {minute:num}
 * @return: minute*60
 */
export function formatToSecond(minute) {
    return minute * 60;
}

/**
 * @description: 格式化到分钟
 * @param {second}
 * @return:second/60
 */
export function formatToMinute(second) {
    return second / 60;
}
