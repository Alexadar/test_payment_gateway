require('../shared/global.js').init().then(() =>
    require('./webFacade.js').startServer()
).catch((err) => { console.log(err); process.exit() });