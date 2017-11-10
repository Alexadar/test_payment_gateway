var expect = require('chai').expect;
var assert = require('assert');

var unsecureEndpoint = require('../server/endpoints/unsecure.js');
var mainEndpoint = require('../server/endpoints/main.js');

var user1id = "test1@test.com";
var user2id = "test2@test.com";

var secret1 = "secret1";
var secret2 = "secret2";

var token1, token2;
var globalVariables = require('../shared/global.js');

var createdTransactions = [];

describe('Root handlers test', function () {

    before(async () => {
        await globalVariables.init();
    });

    after(async () => {
        await global.db.users.deleteUser({ id: user1id });
        await global.db.users.deleteUser({ id: user2id });
        createdTransactions.forEach(async (tran) => {
            await global.db.transactions.deleteTransaction(tran);
        });
    });

    it('Registration test', async () => {
        var createdUser1 = await unsecureEndpoint.root.createUser({ id: user1id, secret: secret1 });
        var createdUser2 = await unsecureEndpoint.root.createUser({ id: user2id, secret: secret2 });
        expect(createdUser1.id).to.equal(user1id);
        expect(createdUser2.id).to.equal(user2id);
    });

    it('Login test', async () => {
        var calculatedToken1 = global.utils.encryptor.encrypt(user1id);
        var calculatedToken2 = global.utils.encryptor.encrypt(user2id);
        var token1 = await unsecureEndpoint.root.login({ id: user1id, secret: secret1 });
        var token2 = await unsecureEndpoint.root.login({ id: user2id, secret: secret2 });
        expect(global.utils.encryptor.decrypt(calculatedToken1)).to.equal(global.utils.encryptor.decrypt(token1));
        expect(global.utils.encryptor.decrypt(calculatedToken2)).to.equal(global.utils.encryptor.decrypt(token2));
    });

    it('Transfer money test', async() => {
        var req1Mock = {
            userId: user1id
        };
        var req2Mock = {
            userId: user2id
        };
        var sendAmount = 17;
        var transaction = await mainEndpoint.root.sendMoney({recipientId: user2id, amount: sendAmount}, req1Mock);
        var user1 = await mainEndpoint.root.getUser({}, req1Mock); 
        var user2 = await mainEndpoint.root.getUser({}, req2Mock);
        createdTransactions.push(transaction);
        expect(transaction.amount).to.equal(sendAmount);
        expect(user2.amount - user1.amount).to.equal(sendAmount * 2);
    });

});