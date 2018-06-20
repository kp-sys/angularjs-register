const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: {
        register: './src/register.ts'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',

        library: 'angularjs-register',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: 'tslint-loader'
            },

            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader'
                }]
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.ts']
    },

    externals: {
        angular: 'angular'
    },

    plugins: [
        new CleanWebpackPlugin(
            ['dist/*.*'],
            {
                root: path.resolve('.'),
                verbose: true
            }
        )
    ]
};