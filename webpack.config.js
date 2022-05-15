const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    watch: true,
    mode: "development",
    // entry: {
        entry: './dist/main.js',
        // another: './dist/**/*.js'
    // },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader'
            },
            {
                test: /\.(png|svg|jpg|jpeg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(glb|obj|mtl|gltf)$/i,
                type: 'asset/resource'
            }
        ]
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve( __dirname, 'dist' )
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin()
    ],
}