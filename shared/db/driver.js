var mongoClient = require('mongodb').MongoClient;

var mongodb;

exports.init = () => {
    return new Promise(async (resolve, reject) => {
        try {
            mongoClient.connect(
                global.environment.databaseConnectionString,
                function (err, db) {
                    if (err) {
                        reject(err);
                    }
                    mongodb = db;
                    exports.dbClient = mongodb;
                    resolve();
                }
            );
        } catch (e) {
            reject(e);
        }
    });
} 