const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: {
        register: './src/register.js'
    },

    output: {
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',

        library: 'register',
        libraryTarget: 'umd'
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
                use: 'babel-loader'
            }
        ]
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