import moment from "moment";
import {
    format1To100,
    formatToPercent,
    format1To1000
} from "./../../../util/filterMethods";
// 验证最后一项的完整性
let checkLast = (f, type) => {
    // 处理最后一项
    // distance_last中值处理之后变成Number类型,判断的时候注意转换类型
    let distance_last = f.distances[f.distances.length - 1];
    if (
        !(
            distance_last.endDistance >= 0 &&
            distance_last.startDistance >= 0 &&
            distance_last.price >= 0
        )
    ) {
        f.distances.pop();
    }
    if (type == "not_food") {
        let weights_last = f.weights[f.weights.length - 1];
        if (
            !(
                weights_last.startWeight >= 0 &&
                weights_last.endWeight >= 0 &&
                weights_last.addPrice >= 0
            )
        ) {
            f.weights.pop();
        }
    }

    let extra_last = f.extraDefine.extras[f.extraDefine.extras.length - 1];
    if (!(extra_last.startAt && extra_last.endAt && extra_last.price >= 0)) {
        f.extraDefine.extras.pop();
    }
    let discount_last =
        f.discountDefine.discountRules[
            f.discountDefine.discountRules.length - 1
        ];
    if (
        !(
            (discount_last.endDistance >= 0 &&
                discount_last.startDistance >= 0 &&
                discount_last.ratio >= 0) ||
            (discount_last.startAt &&
                discount_last.endAt &&
                discount_last.ratio >= 0)
        )
    ) {
        f.discountDefine.discountRules.pop();
    }
    return f;
};
// 格式化提交数据
let format = form => {
    if (!form) return;
    let f = JSON.parse(JSON.stringify(form));
    let type = "";
    for (let key in f) {
        let arr = [];
        if (key == "price") {
            f[key] = f[key] * 100;
        } else if (key == "subsidyRatio") {
            f[key] = formatToPercent(Number(f[key]));
        } else if (key == "drawOutRatio") {
            f[key] = formatToPercent(Number(f[key]));
        } else if (key == "orderType") {
            type = f[key];
        } else if (key == "distances") {
            arr = f[key];
        } else if (key == "discountDefine") {
            arr = f[key].discountRules;
        } else if (key == "extraDefine") {
            arr = f[key].extras;
        } else if (key == "weights") {
            arr = f[key] || [];
        }
        let l = arr.length;
        if (arr && l > 0) {
            for (let i = 0; i < l; i++) {
                if (arr[i].startAt && arr[i].endAt) {
                    arr[i].startAt = moment(arr[i].startAt).format("X") - 0;
                    arr[i].endAt = moment(arr[i].endAt).format("X") - 0;
                }
                if (arr[i].price >= 0) {
                    // arr[i].price = arr[i].price * 100;
                    arr[i].price = format1To100(arr[i].price);
                }
                if (arr[i].addPrice >= 0) {
                    // arr[i].addPrice = arr[i].addPrice * 100;
                    arr[i].addPrice = format1To100(arr[i].addPrice);
                }
                if (arr[i].ratio >= 0) {
                    // arr[i].ratio = Number(arr[i].ratio) / 100;
                    arr[i].ratio = formatToPercent(Number(arr[i].ratio));
                }
                if (arr[i].startDistance >= 0 && arr[i].endDistance >= 0) {
                    // arr[i].startDistance = arr[i].startDistance * 1000;
                    // arr[i].endDistance = arr[i].endDistance * 1000;
                    arr[i].startDistance = format1To1000(arr[i].startDistance);
                    arr[i].endDistance = format1To1000(arr[i].endDistance);
                }
                // if (arr[i]["distances-price"]) {
                //     arr[i]["distances-price"] =
                //         arr[i]["distances-price"] * 100;
                // }
            }
        }
    }
    return checkLast(f, type);
};
const state = {
    out: {
        orderType: "food",
        price: "",
        subsidyRatio: "",
        drawOutRatio: "",
        distances: [{}],
        discountDefine: {
            isOpen: "1",
            discountRules: [{}]
        },
        extraDefine: {
            isOpen: "1",
            extras: [{}]
        }
    },
    self: {
        orderType: "not_food",
        price: "",
        subsidyRatio: "",
        drawOutRatio: "",
        distances: [{}],
        weights: [{}],
        discountDefine: {
            isOpen: "1",
            discountRules: [{}]
        },
        extraDefine: {
            isOpen: "1",
            extras: [{}]
        }
    }
};

const getters = {
    formatOut(state) {
        let out = format(state.out);
        return out;
    },
    formatSelf(state) {
        let self = format(state.self);
        return self;
    }
};
const mutations = {
    saveTemplate(state, payload) {
        if (payload.key && payload.form) {
            state[payload.key] = payload.form;
        }
    },
    resetTemplate(state, payload) {
        state["out"] = {
            orderType: "food",
            price: "",
            subsidyRatio: "",
            drawOutRatio: "",
            distances: [{}],
            discountDefine: {
                isOpen: "1",
                discountRules: [{}]
            },
            extraDefine: {
                isOpen: "1",
                extras: [{}]
            }
        };
        state["self"] = {
            orderType: "not_food",
            price: "",
            subsidyRatio: "",
            drawOutRatio: "",
            distances: [{}],
            weights: [{}],
            discountDefine: {
                isOpen: "1",
                discountRules: [{}]
            },
            extraDefine: {
                isOpen: "1",
                extras: [{}]
            }
        };
    }
};
export default {
    namespaced: true,
    state,
    getters,
    mutations
};
