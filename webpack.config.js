const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './js/main.js',
    module: {
        rules: [
            { test: /\.(js)$/, use: 'babel-loader' }
        ]
    },
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: "index_bundle.js"
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    mode: "development"
}