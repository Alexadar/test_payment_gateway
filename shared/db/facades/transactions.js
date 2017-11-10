exports.addTransaction = async (transaction) => {
    await global.db.driver.dbClient.collection('transactions').insert(transaction);
}

exports.deleteTransaction = async (transaction) => {
    await global.db.driver.dbClient.collection('transactions').remove({ _id: transaction._id });
}

exports.getUsersTransactions = async (userId) => {
    return await global.db.driver.dbClient.collection('transactions').find({ $or: [{ sender: userId }, { recipient: userId }] }).toArray();
}