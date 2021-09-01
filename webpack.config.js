const {resolve} = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractCssPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
//css兼容处理
const commonCssLoader = {
    loader: "postcss-loader",
    options: {
        ident: "postcss",
        plugins: () => [
            require("postcss-preset-env")()
        ]
    }
}

//vue-loader options
function cssLoaders(options) {

    function generateLoaders(loadername) {
        const cssLoader = {
            loader: 'css-loader'
        }
        const postcssLoader = {
            loader: 'postcss-loader'
        }
        const loaderArr = [cssLoader, postcssLoader];
        if (loadername) {
            loaderArr.push({
                loader: `${loadername}-loader`
            })
        }

        if(options.extract){
            return [ExtractCssPlugin.loader].concat(loaderArr);
        }else{
            return ["vue-style-loader"].concat(loaderArr);
        }

    }
    return {
        css: generateLoaders(),
        less: generateLoaders('less')
    }
}

module.exports = {
    entry: "./src/index.js",
    devtool:"cheap-module-eval-source-map",
    output: {
        path: resolve(__dirname, "dist"),
        filename: "js/bundle.js",
        publicPath: "/"
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: "babel-loader", //对js做兼容处理
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: {
                                    "chrome": "87",
                                    "ie": "9",
                                    "firefox": "60"
                                },
                                "corejs": "3", //处理Promise，Proxy新类
                                "useBuiltIns": "usage" //按需加载
                            }
                        ]
                    ]
                }
            }]
        }, {
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
                loaders: cssLoaders({
                    extract: true
                })
            }
        }, {
            test: /\.css$/,
            exclude: /^bootstrap/,
            // use: ["style-loader", "css-loader", commonCssLoader]
            use: [ExtractCssPlugin.loader, "css-loader", commonCssLoader]
        }, {
            test: /\.less$/,
            // use: ["style-loader", "css-loader", commonCssLoader, "less-loader"]
            use: [ExtractCssPlugin.loader, "css-loader", commonCssLoader, "less-loader"]
        }, {
            test: /\.(png|jpg|gif)/i,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 8 * 1024,
                    outputPath: "images",
                    name: "[hash:8].[ext]",
                    esModule: false
                }
            }]
        }, {
            test: /\.html$/i,
            use: ["html-loader"]
        }, {
            exclude: /\.(html|js|css|less|scss|png|jpg|gif|vue|jsx)/i,
            use: [{
                loader: "file-loader",
                options: {
                    outputPath: "others",
                    name: "[hash:10].[ext]",
                }
            }]

        }]
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            "@": resolve("src"),
            "assets": resolve("src/assets"),
            "components": resolve("src/components"),
            "views": resolve("src/views"),
            "network": resolve("src/network"),
            "route":resolve("src/route"),
            "util":resolve("src/util"),
            "store":resolve("src/store")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, "public", "index.html")
        }),
        new VueLoaderPlugin(),
        new ExtractCssPlugin({
            filename: "css/main.css"
        }),
        new CopyWebpackPlugin([{
            from: __dirname + '/public',
            to: __dirname + '/dist/static'
        }])
    ],
    mode: "development",
    devServer: {
        contentBase: resolve(__dirname, "build"),
        port: "8088",
        // hot: true,
        compress: true,
        //historyApiFallback:true
        historyApiFallback:{
            rewrite:[{
                from:/.*/g,
                to:"/index.html"
            }]
        }
    }
}