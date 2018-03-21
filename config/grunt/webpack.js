const { resolve } = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    default: {
        entry: {
            worker: './build/es2015/module.js'
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
                            'external-helpers',
                            [
                                'transform-runtime', {
                                    polyfill: false
                                }
                            ]
                        ],
                        presets: [
                            [
                                'es2015',
                                {
                                    modules: false
                                }
                            ]
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
