const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    devServer: {
        contentBase: path.join(__dirname, "../dist/"),
        port: 3001
    },
    devtool: 'eval-source-map',
    mode: 'development',
    output: {
        filename: 'typechess.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            title: 'TypeChess',
            version: 'Development',
            template: './src/index.html',
            filename: './index.html' //relative to root of the output path
        })
    ],
    watch: true
});