const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const pkg = require('./package.json');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: {
        'register.min': './src/register.js'
    },

    output: {
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',

        library: pkg.name,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'eslint-loader'
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }]
            }
        ]
    },

    externals: {
        angular: 'angular'
    },

    devtool: 'source-map',

    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
            cleanStaleWebpackAssets: false
        }),
        new UnminifiedWebpackPlugin()
    ]
};
