const path = require('path')
const webpack = require('webpack')

config = {
    mode: "production",
    entry: [
        path.join(__dirname, 'client/main.js')
    ],
    output: {
        path: path.join(__dirname, '/dist'),
        filename: "bundle.js",
        publicPath: "/dist",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader"
                }
            }
        ]
    }
}

module.exports = config