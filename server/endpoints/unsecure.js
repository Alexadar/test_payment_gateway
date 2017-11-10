var fs = require('fs');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

exports.root = {
    createUser: async ({ id, secret }) => {
        var user = await global.db.users.getUser(id);
        if (user) {
            if (user.isCreated) {
                throw global.utils.createError(id, global.constants.errorCodes.userAllreadyExist);
            }
            else {
                user.isCreated = true;
                user.secret = secret;
                user.amount += global.constants.bonusRegistrationAmount
                await global.db.users.updateUser(user);
            }
        } else {
            user = {
                id: id,
                secret: secret,
                isCreated: true,
                amount: global.constants.bonusRegistrationAmount
            }
            await global.db.users.createUser(user);
        }

        return user;
    },
    login: async ({ id, secret }) => {
        var user = await global.db.users.getUser(id);
        if (!user || !user.isCreated || (user.secret !== secret)) {
            throw global.utils.createError(id, global.constants.errorCodes.notAuthorized);
        }
        return global.utils.encryptor.encrypt(user.id);
    }
};

exports.init = (app) => {
    var schemaNode = fs.readFileSync('./schemas/unsecure.graphql', 'utf8');
    var schema = buildSchema(schemaNode);

    app.use('/unsecure', graphqlHTTP({
        schema: schema,
        rootValue: exports.root,
        graphiql: true,
        formatError: global.expressExtentions.processError
    }));
}