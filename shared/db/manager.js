exports.init = async () => {
    var driver = require("./driver.js");
    await driver.init();
    exports.driver = driver;
    exports.users = require('./facades/users.js');
    exports.transactions = require('./facades/transactions.js');
}