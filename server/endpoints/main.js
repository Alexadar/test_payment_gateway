var fs = require('fs');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

exports.root = {
    getUser: async ({ }, req) => {
        req.throwIfNotAuthorized();
        var user = await global.db.users.getUser(req.userId);
        user.transactions = await global.db.transactions.getUsersTransactions(user.id);
        return user;
    },
    sendMoney: async ({ recipientId, amount }, req) => {
        req.throwIfNotAuthorized();
        var user = await global.db.users.getUser(req.userId);
        var recipient = await global.db.users.getUser(recipientId);
        if (!recipient) {
            //creating ghost user to receive money anyway
            recipient = {
                id: recipient,
                isCreated: false,
                amount: 0
            }
            await global.db.users.createUser(recipient);
        }
        if (user.amount < amount) {
            throw global.utils.createError(id, global.constants.errorCodes.badInput);
        }
        // i aware that mongo is not reliable for financial transactions, but i leave it as it is for test task
        // if you want i can upgrade it to MySQL ACID transactions
        user.amount -= amount;
        recipient.amount += amount;
        var transaction = {
            sender: user.id,
            recipient: recipient.id,
            amount: amount,
            time: (new Date()).getTime()
        }
        await global.db.users.updateUser(user);
        await global.db.users.updateUser(recipient);
        await global.db.transactions.addTransaction(transaction);
        return transaction;
    }
};

exports.init = (app) => {
    var schemaNode = fs.readFileSync('./schemas/main.graphql', 'utf8');
    var schema = buildSchema(schemaNode);

    app.use('/main', graphqlHTTP({
        schema: schema,
        rootValue: exports.root,
        graphiql: true,
        formatError: global.expressExtentions.processError
    }));
}