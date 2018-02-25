const { resolve } = require('path');

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
        output: {
            filename: '[name].min.js',
            path: resolve('build/es5')
        },
        target: 'webworker'
    }
};
