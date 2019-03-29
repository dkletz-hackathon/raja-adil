import * as Queue from "bee-queue";
import RedisService from "./RedisService";
import DatabaseService from "./DatabaseService";
import {Transaction, TransactionType} from "./models/Transaction";
import * as BriHelper from "./helpers/BriHelper";

const returnQueue = new Queue('return', {
  redis: RedisService.getClient(),
  removeOnSuccess: true,
  removeOnFailure: true
});

const receiveQueue = new Queue('receive', {
  redis: RedisService.getClient(),
  removeOnSuccess: true,
  removeOnFailure: true
});

const handleReturnAsync = async (job) => {
  const txRepository = DatabaseService.getConnection().getRepository(Transaction);
  const { order_id, total_price, card } = job.data;
  const resp = await BriHelper.transfer("888801000157508", card.card_number, total_price, `20190329007JE${order_id}`);
  if (resp.responseCode === "0200") {
    const newTx = await txRepository.create({
      from: 0,
      to: card.user_id,
      ref_code: "20190329007JE",
      type: TransactionType.RETURN
    });
    await txRepository.save(newTx);
    return true;
  } else {
    return false;
  }
};

const handleReceiveAsync = async (job) => {
  const txRepository = DatabaseService.getConnection().getRepository(Transaction);
  const { order_id, total_price, card } = job.data;
  const resp = await BriHelper.transfer("888801000003301", card.card_number, total_price, `20190329007JE${order_id}`);
  if (resp.responseCode === "0200") {
    const newTx = await txRepository.create({
      from: 0,
      to: card.user_id,
      ref_code: "20190329007JE",
      type: TransactionType.RECEIVE
    });
    await txRepository.save(newTx);
    return true;
  } else {
    return false;
  }
};

returnQueue.on('ready',  () => {
  returnQueue.process(handleReturnAsync);
});

receiveQueue.on('ready', () => {
  receiveQueue.process(handleReceiveAsync);
});

export {
  returnQueue, receiveQueue
}
