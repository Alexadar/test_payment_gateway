var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
var server = http.createServer(app);
var unsecureEndpoint = require('./endpoints/unsecure.js');
var mainEndpoint = require('./endpoints/main.js');

var options = {};

var initApp = () => {
    app.use(bodyParser.json());
    app.use(global.expressExtentions.extentions);
    app.use(global.expressExtentions.errorHandler);
};

var initApi = () => {
    unsecureEndpoint.init(app);
    mainEndpoint.init(app);
};

exports.startServer = () => {
    initApp();
    initApi();
    server.listen(global.environment.apiPort);
    console.log(`Payment gateway api started on port ${global.environment.apiPort}`);
};