module.exports = (config) => {

    config.set({
        files: [
            './node_modules/angular/angular.js',
            './node_modules/angular-mocks/angular-mocks.js',
            './src/register.js',
            './test/register.spec.js'
        ],

        preprocessors: {
            'src/register.js': ['webpack', 'sourcemap'],
            'test/register.spec.js': ['webpack']
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
                                'plugins': [
                                    '@babel/plugin-proposal-class-properties'
                                ],
                                'presets': [
                                    [
                                        'env',
                                        {
                                            'targets': {
                                                'browsers': [
                                                    'last 2 versions',
                                                    'IE 11'
                                                ]
                                            }
                                        }
                                    ]
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