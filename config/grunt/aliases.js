module.exports = {
    build: [
        'clean:build',
        'sh:build-es2015',
        'sh:build-es5',
        'sh:build-esm',
        'uglify'
    ],
    continuous: [
        // @todo This is broken now.
        'karma:continuous'
    ],
    lint: [
        'eslint',
        // @todo Use grunt-lint again when it support the type-check option.
        'sh:lint'
    ],
    test: [
        'karma:test-integration',
        'karma:test-unit'
    ]
};
