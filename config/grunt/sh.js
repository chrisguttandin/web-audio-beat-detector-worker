module.exports = (grunt) => {
    const continuous = (grunt.option('continuous') === true);

    return {
        'build-es2018': {
            cmd: 'tsc -p src/tsconfig.json'
        },
        'build-es5': {
            cmd: 'rollup -c config/rollup/bundle.js'
        },
        'lint': {
            cmd: 'tslint --config config/tslint/src.json --project src/tsconfig.json src/*.ts src/**/*.ts'
        },
        'test-integration': {
            cmd: `karma start config/karma/config-integration.js ${ continuous ? '--concurrency Infinity' : '--single-run' }`
        },
        'test-unit': {
            cmd: `karma start config/karma/config-unit.js ${ continuous ? '--concurrency Infinity' : '--single-run' }`
        }
    };
};
