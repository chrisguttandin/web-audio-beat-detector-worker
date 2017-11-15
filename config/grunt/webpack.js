const { resolve } = require('path');
const { optimize: { UglifyJsPlugin } } = require('webpack');

module.exports = {
    default: {
        entry: {
            worker: './build/es2015/module.js'
        },
        module: {
            rules: [ {
                exclude: /node_modules/,
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
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
        output: {
            filename: '[name].min.js',
            path: resolve('build/es5')
        },
        plugins: [
            new UglifyJsPlugin({
                output: {
                    comments: false
                }
            })
        ],
        target: 'webworker'
    }
};
