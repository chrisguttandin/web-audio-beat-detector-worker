module.exports = {
    'continuous': {
        configFile: 'config/karma/config.js'
    },
    'test-integration': {
        configFile: 'config/karma/config-integration.js',
        singleRun: true
    },
    'test-unit': {
        configFile: 'config/karma/config-unit.js',
        singleRun: true
    }
};
