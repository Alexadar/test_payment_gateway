exports.extentions = (req, res, next) => {

    try {
        var authString = req.headers[global.constants.apiAuthHeader];
        if (authString) {
            req.userId = global.utils.encryptor.decrypt(authString);
        }
    } catch (error) {
        console.log(error);
    }

    return next();
}

exports.errorHandler = (err, req, res, next) => {
    global.logger.catchHandler(err);
    res.status(500);
    res.end('Internal server error');
}

exports.processError = (err) => {
    var code = parseInt(err.message);
    //not codeded error
    if (!code) {
        code = global.constants.errorCodes.general;
        console.log(err);
    }
    return {
        code: code
    }
};