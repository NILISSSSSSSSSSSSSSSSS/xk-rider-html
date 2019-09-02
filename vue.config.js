const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    // 基本路径
    baseUrl: process.env.NODE_ENV === "production" ? "/rider/" : "/",
    // 输出文件目录
    outputDir: "dist",
    assetsDir: "static",
    // webpack-dev-server 相关配置
    // productionGzip: true,
    // productionGzipExtensions: ['js', 'css'],
    devServer: {
        open: process.platform === "darwin",
        host: "0.0.0.0",
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {
            "/api": {
                target: "https://dev.api.xksquare.com",
                changeOrigin: true
            }
            // '/api': {
            //     target: 'https://test.api.xksquare.com',
            //     changeOrigin: true
            // },
            // "/test": {
            //     target: "https://test.api.xksquare.com",
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/test": "/api"
            //     }
            // },
            // "/manager": {
            //     target: "https://dev.api.xksquare.com",
            //     changeOrigin: true
            // },
            // "/local1": {
            //     target: "http://192.168.2.253:8092",
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/local1": "/api"
            //     }
            // },
            // "/locallogin": {
            //     target: "http://192.168.2.253:8081",
            //     changeOrigin: true,
            //     pathRewrite: {
            //         "^/locallogin": "/api"
            //     }
            // }
        }, // 设置代理
        before: app => {}
    },
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    //将接收ChainableConfig由webpack-chain提供支持的实例的函数。允许对内部webpack配置进行更细粒度的修改
    chainWebpack: config => {
        config.plugins.delete("prefetch");
    },
    transpileDependencies: [
        // 'vue-quill-editor',
        // 'quill-image-extend-module',
        // 'quill-image-resize-module',
        // 'quill',
    ],
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            return {
                externals: {
                    vue: "Vue",
                    vuex: "Vuex",
                    "element-ui": "ELEMENT",
                    "vue-router": "VueRouter",
                    axios: "axios"
                },
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|\.css/,
                        threshold: 10240,
                        deleteOriginalAssets: false
                    }),
                    new webpack.ProvidePlugin({
                        //富文本
                        "window.Quill": "quill/dist/quill.js",
                        Quill: "quill/dist/quill.js"
                    }),
                    new UglifyJsPlugin({
                        terserOptions: {
                            compress: {
                                warnings: false,
                                drop_console: true,
                                drop_debugger: false,
                                pure_funcs: ["console.log"] //移除console
                            }
                        }
                    })
                ]
            };
        } else {
            return {
                devtool: "source-map",
                plugins: [
                    new webpack.ProvidePlugin({
                        "window.Quill": "quill/dist/quill.js",
                        Quill: "quill/dist/quill.js"
                    })
                ]
            };
        }
    },
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require("os").cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
};
