const { resolve } = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    default: {
        entry: {
            worker: './build/es2018/module.js'
        },
        mode: 'production',
        module: {
            rules: [ {
                exclude: /node_modules/,
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-external-helpers',
                            '@babel/plugin-transform-runtime'
                        ],
                        presets: [
                            [ '@babel/preset-env', {
                                include: [
                                    'transform-template-literals'
                                ],
                                targets: {
                                    browsers: [
                                        'last 2 Chrome versions',
                                        'last 2 ChromeAndroid versions',
                                        'last 2 Edge versions',
                                        'last 2 Firefox versions',
                                        'last 2 FirefoxAndroid versions',
                                        'last 2 iOS versions',
                                        'last 2 Opera versions',
                                        'last 2 Safari versions'
                                    ]
                                }
                            } ]
                        ]
                    }
                }
            } ]
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    extractComments: {
                        banner: false,
                        condition: /^\**!|@preserve|@license|@cc_on/,
                        filename: '3rdpartylicenses.txt'
                    }
                })
            ]
        },
        output: {
            filename: '[name].min.js',
            path: resolve('build/es5')
        },
        target: 'webworker'
    }
};
