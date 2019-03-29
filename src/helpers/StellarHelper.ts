import StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

server.transactions()
  .forAccount('GBJ2DONLQHO6P5L4TS3BDH5255STGMKZLVYLTZR23A3ZQUXKTLSTNEYN')
  .call()
  .then((r: any) => { 
    console.log(r.records[0]._links); 
  });