/**
 * Created by qiushaoyu on 2017/12/6.
 */
// import axios from 'axios'
import config from './config'
import {
    assembleParams
} from '../util/publicMehotds'
import service from '../service'
// import {
//     getSession
// } from '../util/publicMehotds';

// import axios from "axios"

const http = {
    /**
     * axios Post请求
     * @param service  服务器API
     * @param params  对象参数
     * @param isEncrypt  data是否加密
     * @param timeout  请求超时时间
     * @returns {Promise}
     * @constructor
     */
    post(service, params, isEncrypt, isPHP, timeout) {
        return new Promise((resolve, reject) => {

            params = assembleParams(service, params, isEncrypt, isPHP);

            if (timeout) {
                config.timeout = timeout;
            }
            config.params = "";
            axios.post(service, params, config)
                .then(res => {
                    //请求成功回调
                    if (res.data.code === 200) {
                        resolve(res.data.body);
                    } //服务器错误
                    else if (res.data.code === 409) {
                        //返回为空
                        resolve("");
                    } else if (res.data.code === 500) {
                        reject(res.data);
                    } //其它异常
                    else {
                        reject(res.data);
                    }
                })
                .catch(err => {
                    console.log("​post -> err", err);
                    // alert(err);
                    reject(err)
                })
        })
    },
    /**
     * axios  Get请求
     * @param service  服务器api
     * @param params  路径参数
     * @param isEncrypt  data是否加密
     * @returns {Promise}
     * @constructor
     */
    get(service, params, isEncrypt, isPHP) {
        return new Promise((resolve, reject) => {
            params = assembleParams(service, params, isEncrypt, isPHP);
            config.params = params;
            axios.get(service, config)
                .then(res => {
                    //请求成功回调
                    if (res.data.code === 200) {
                        resolve(res.data.body);
                    } //服务器错误
                    else if (res.data.code === 409) {
                        //返回为空
                        resolve("");
                    } else if (res.data.code === 500) {
                        reject(res.data);
                    } //其它异常
                    else if (res.data.code === 415) {
                        //415  该接口为缓存接口   服务端未更新数据缓存  前端不更新数据缓存
                        resolve("");
                    } else {
                        reject(res.data);
                    }
                })
                .catch(err => {
                    reject(err);
                })

        })
    },

    // uploadFile(service, param) {
    //     return new Promise((resolve, reject) => {
    //         let config = {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         };
    //         param.append('userId', JSON.parse(getSession('xk-music')).id);
    //         param.append('token', JSON.parse(getSession('xk-music')).token);

    //         axios.post(service, param, config)
    //             .then(res => {
    //                 //请求成功回调
    //                 if (res.data.code === 200) {
    //                     resolve(res.data.body);
    //                 } //服务器错误
    //                 else if (res.data.code === 409) {
    //                     //返回为空
    //                     resolve("");
    //                 } else if (res.data.code === 500) {
    //                     reject(res.data);
    //                 } //其它异常
    //                 else {
    //                     reject(res.data);
    //                 }
    //             })
    //             .catch(err => {
    //                 alert(err);
    //                 reject(err)
    //             })
    //     })

    // }
};

export function getTemp() {
    let temp = localStorage.getItem("timestamp");
    if (!temp) {
        http.get(service.timestamp, {})
            .then(res => {
                if (res) {
                    const obj = {
                        temp: res.timestamp,
                        currentTemp: Date.parse(new Date())
                    };
                    localStorage.setItem("timestamp", JSON.stringify(obj));
                }
            })
            .catch(err => {
                Message.error("获取systemTime失败")
            })
    }
}


/***
 * 不需要验证resultCode 的API
 * @param api
 * @returns {boolean}
 */
// function checkUrl(api) {
//     return noCheckUrl.some((v, i) => (v === api));
// }


export default http;