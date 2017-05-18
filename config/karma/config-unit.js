module.exports = (config) => {

    config.set({

        basePath: '../../',

        client: {
            mochaWebWorker: {
                evaluate: {
                    // This is basically a part of the functionality which karma-sinon-chai would provide in a Window.
                    beforeRun : `(function(self) {
                        self.should = null;
                        self.should = self.chai.should();
                        self.expect = self.chai.expect;
                        self.assert = self.chai.assert;
                    })(self);`
                },
                pattern: [
                    '**/chai/**',
                    '**/leche/**',
                    '**/lolex/**',
                    '**/sinon/**',
                    '**/sinon-chai/**',
                    'test/unit/**/*.js'
                ]
            }
        },

        concurrency: 2,

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: true,
                watched: true
            }, {
                included: false,
                pattern: 'test/fixtures/**',
                served: true,
                watched: true
            }, {
                included: false,
                pattern: 'test/unit/**/*.js',
                served: true,
                watched: true
            }
        ],

        frameworks: [
            'leche',
            'mocha-webworker',
            'sinon-chai'
        ],

        mime: {
            'text/x-typescript': [ 'ts', 'tsx' ]
        },

        preprocessors: {
            'src/**/*.ts': 'webpack',
            'test/unit/**/*.js': 'webpack'
        },

        webpack: {
            module: {
                loaders: [
                    {
                        loader: 'ts-loader',
                        test: /\.ts?$/
                    }
                ]
            },
            resolve: {
                extensions: [ '.js', '.ts' ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    });

    if (process.env.TRAVIS) {

        config.set({

            browserNoActivityTimeout: 20000,

            browsers: [
                'ChromeSauceLabs',
                'FirefoxSauceLabs',
                'SafariSauceLabs'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'OS X 10.11'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.11'
                },
                SafariSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'safari',
                    platform: 'OS X 10.11'
                }
            },

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'Chrome',
                'ChromeCanary',
                'Firefox',
                'FirefoxDeveloper',
                'Safari'
            ]

        });

    }

};
