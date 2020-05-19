const path = require('path')
const webpack = require('webpack')
const nodeExternal = require('webpack-node-externals')

config = {
    name: "server",
    entry: [
        path.join(__dirname, 'server/server.js')
    ],
    output: {
        path: path.join(__dirname, '/dist'),
        filename: "server.generated.js",
        publicPath: "/dist/"
    },
    target: "node",
    externals: [nodeExternal()],
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
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
    } 
}

module.exports = config