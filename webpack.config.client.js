const path = require('path')
const webpack = require('webpack')

config = {
    name: "browser",
    mode: "development",
    devtool: "source-map",
    entry: [
        "react-hot-loader/patch",
        "webpack-hot-middleware/client?reload=true",
        './client/main.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js",
        publicPath: "/dist/"
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg|jpg)$/i,
                use: {
                    loader: "file-loader?name=client/assets/image/[name].[ext]"
                }
            }
        ]
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    devServer: {
        historyApiFallback: true
    }
}

module.exports = config