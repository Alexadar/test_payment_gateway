exports.init = async () => {
    // very important
    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });

    global.constants = require('./constants.js');
    global.environment = require('./environment.js');
    global.db = require('./db/manager.js');
    global.logger = require('./logger.js');
    global.expressExtentions = require('./http/expressExtentions.js');
    global.utils = require('./utils.js');
    await global.db.init();
}