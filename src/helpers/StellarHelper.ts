import StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const getWalletTransactions = async () => {
  const resp = await server.transactions()
    .forAccount('GBJ2DONLQHO6P5L4TS3BDH5255STGMKZLVYLTZR23A3ZQUXKTLSTNEYN')
    .call();
  return resp.records;
};

const getWalletByHash = async (hash: string) => {
  return await server.transactions()
    .forTransaction(hash)
    .call();
};

const createTransactionData = async (memo: string) => {
  const account = await server.loadAccount(process.env.PUB_KEY_SRC);
  const fee = await server.fetchBaseFee();

  const transaction = new StellarSdk.TransactionBuilder(account, {fee})
    .addOperation(
      StellarSdk.Operation.payment({
        destination: process.env.PUB_KEY_DEST,
        asset: StellarSdk.Asset.native(),
        amount: "1"
      })
    )
    .addMemo(StellarSdk.Memo.text(memo))
    .setTimeout(30)
    .build();
  transaction.sign(StellarSdk.Keypair.fromSecret(process.env.SECRET_KEY_SRC));
  return await server.submitTransaction(transaction);
};
