const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') });
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    const isDevelopment = argv.mode === 'development'


    return {
        entry: './websrc/main.js',
        output: {
        filename: 'main.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: isDevelopment ? '/' : './',

        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'public'),
            },
            hot: true,
            port: 3000,
        },
        plugins: [
            new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed)
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'index.html'),
                filename: 'index.html',
            }),  
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'tos.html'),
                filename: 'tos.html',
            }), 
            new MiniCssExtractPlugin({
                filename: "styles.css",
              }),
            

        ],
        module: {
            rules: [
            {
                test: /\.css$/,
                // use: [MiniCssExtractPlugin.loader,  'css-loader', 'postcss-loader'],
                // use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader', 'postcss-loader'],
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            ],
        },
    };
}