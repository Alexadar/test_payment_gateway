exports.createError = (userId, errorCode) => {
    console.log(`userId ${userId} got error code ${errorCode}`);
    var error = new Error(errorCode);
    return error;
};

exports.encryptor = require('simple-encryptor')(global.constants.userTokenKey);