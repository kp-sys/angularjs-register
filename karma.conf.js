module.exports = (config) => {

    config.set({
        files: [
            './node_modules/angular/angular.js',
            './node_modules/angular-mocks/angular-mocks.js',
            './dist/register.min.js',
            'src/**.spec.js'
        ],

        preprocessors: {
            'src/**.spec.js': ['webpack']
        },

        frameworks: ['jasmine'],

        browsers: ['ChromiumHeadlessNoSandbox'],

        customLaunchers: {
            'ChromiumHeadlessNoSandbox': {
                base: 'ChromiumHeadless',
                flags: [
                    '--disable-gpu',
                    '--no-sandbox'
                ],
                debug: true
            }
        },

        plugins: [
            require('karma-webpack'),
            require('karma-jasmine'),
            require('karma-spec-reporter'),
            require('karma-source-map-support'),
            require('karma-sourcemap-loader'),
            require('karma-chrome-launcher')
        ],

        singleRun: true,

        reporters: ['spec'],

        webpack: {
            mode: 'development',

            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [{
                            loader: 'babel-loader',
                            options: {
                                plugins: [
                                    '@babel/plugin-proposal-class-properties'
                                ],
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

            devtool: 'inline-source-map'
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

};
