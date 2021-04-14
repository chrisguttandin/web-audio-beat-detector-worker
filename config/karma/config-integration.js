const { env } = require('process');
const { DefinePlugin } = require('webpack');
const webpack = require('webpack');
const MemoryFileSystem = require('memory-fs');

module.exports = (config) => {
    config.set({
        basePath: '../../',

        browserDisconnectTimeout: 100000,

        browserNoActivityTimeout: 100000,

        concurrency: 1,

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: true,
                watched: true
            },
            {
                included: false,
                pattern: 'test/fixtures/**',
                served: true,
                watched: true
            },
            'test/integration/**/*.js'
        ],

        frameworks: ['leche', 'mocha', 'sinon-chai', 'webpack'],

        middleware: ['webpack'],

        plugins: [
            {
                'middleware:webpack': [
                    'factory',
                    function () {
                        return (req, res, next) => {
                            if (req.url.startsWith('/base/') && req.url.endsWith('.js')) {
                                const parts = req.url.split(/\//);
                                const name = parts.pop().slice(0, -3);
                                const path = parts
                                    .slice(2)
                                    .map((part) => `/${part}`)
                                    .join('');
                                const memoryFileSystem = new MemoryFileSystem();
                                const compiler = webpack({
                                    entry: {
                                        [name]: `.${path}/${name}`
                                    },
                                    mode: 'development',
                                    module: {
                                        rules: [
                                            {
                                                test: /\.ts?$/,
                                                use: {
                                                    loader: 'ts-loader',
                                                    options: {
                                                        compilerOptions: {
                                                            declaration: false,
                                                            declarationMap: false
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    output: {
                                        filename: '[name].js',
                                        path: '/'
                                    },
                                    resolve: {
                                        extensions: ['.js', '.ts'],
                                        fallback: { util: false }
                                    }
                                });

                                compiler.outputFileSystem = memoryFileSystem;
                                compiler.run((err, stats) => {
                                    if (err !== null) {
                                        next(err);
                                    } else if (stats.hasErrors() || stats.hasWarnings()) {
                                        next(new Error(stats.toString({ errorDetails: true, warnings: true })));
                                    } else {
                                        res.setHeader('content-type', 'application/javascript');

                                        memoryFileSystem.createReadStream(`/${name}.js`).pipe(res);
                                    }
                                });
                            } else {
                                next();
                            }
                        };
                    }
                ]
            },
            'karma-*'
        ],

        preprocessors: {
            'src/**/!(*.d).ts': 'webpack',
            'test/integration/**/*.js': 'webpack'
        },

        reporters: ['dots'],

        webpack: {
            mode: 'development',
            module: {
                rules: [
                    {
                        test: /\.ts?$/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                compilerOptions: {
                                    declaration: false,
                                    declarationMap: false
                                }
                            }
                        }
                    }
                ]
            },
            plugins: [
                new DefinePlugin({
                    'process.env': {
                        CI: JSON.stringify(env.CI)
                    }
                })
            ],
            resolve: {
                extensions: ['.js', '.ts'],
                fallback: { util: false }
            }
        },

        webpackMiddleware: {
            noInfo: true
        }
    });

    if (env.CI) {
        config.set({
            browserStack: {
                accessKey: env.BROWSER_STACK_ACCESS_KEY,
                build: `${env.GITHUB_RUN_ID}/integration-${env.TARGET}`,
                forceLocal: true,
                localIdentifier: `${Math.floor(Math.random() * 1000000)}`,
                project: env.GITHUB_REPOSITORY,
                username: env.BROWSER_STACK_USERNAME,
                video: false
            },

            browsers:
                env.TARGET === 'chrome'
                    ? ['ChromeBrowserStack']
                    : env.TARGET === 'firefox'
                    ? ['FirefoxBrowserStack']
                    : env.TARGET === 'safari'
                    ? ['SafariBrowserStack']
                    : ['ChromeBrowserStack', 'FirefoxBrowserStack', 'SafariBrowserStack'],

            captureTimeout: 300000,

            customLaunchers: {
                ChromeBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'chrome',
                    captureTimeout: 300,
                    os: 'OS X',
                    os_version: 'Big Sur' // eslint-disable-line camelcase
                },
                FirefoxBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'firefox',
                    captureTimeout: 300,
                    os: 'Windows',
                    os_version: '10' // eslint-disable-line camelcase
                },
                SafariBrowserStack: {
                    base: 'BrowserStack',
                    browser: 'safari',
                    captureTimeout: 300,
                    os: 'OS X',
                    os_version: 'Big Sur' // eslint-disable-line camelcase
                }
            }
        });
    } else {
        config.set({
            browsers: ['ChromeCanaryHeadless', 'ChromeHeadless', 'FirefoxDeveloperHeadless', 'FirefoxHeadless', 'Safari']
        });
    }
};
