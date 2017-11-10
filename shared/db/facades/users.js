exports.getUser = async (userId) => {
    var users = await global.db.driver.dbClient.collection('users').find({ id: userId }).toArray();
    return users[0];
}

exports.getUsersCount = async () => {
    var count = await global.db.driver.dbClient.collection('users').count();
    return count;
}

exports.createUser = async (user) => {
    await global.db.driver.dbClient.collection('users').insert(user);
}

exports.updateUser = async (user) => {
    await global.db.driver.dbClient.collection('users').update({ id: user.id }, user);
}

exports.deleteUser = async (user) => {
    await global.db.driver.dbClient.collection('users').remove({ id: user.id });
}

//init
(async () => {
    if (await exports.getUsersCount() === 0) {
        global.db.driver.dbClient.collection('users').createIndex({ "id": 1 }, { unique: true })
    }
})();