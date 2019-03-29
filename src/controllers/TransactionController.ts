import {Transaction, TransactionType} from "../models/Transaction";
import * as BriHelper from "../helpers/BriHelper";
import {Request, Response} from "express";
import DatabaseService from "../DatabaseService";
import ApiError from "../ApiError";
import * as Worker from "../Worker";
import {Card} from "../models/Card";

const txRepository = DatabaseService.getConnection().getRepository(Transaction);
const cardRepository = DatabaseService.getConnection().getRepository(Card);

const createPayment = async (req: Request, res: Response) => {
  const {ref_code, user_id} = req.body;
  const transactionData = await BriHelper.getTransactionStatus(ref_code);
  if (transactionData.responseCode === "0300") {
    const tx = await txRepository.create({
      from: user_id,
      to: 0,
      ref_code: ref_code,
      type: TransactionType.PAYMENT
    });
    await txRepository.save(tx);
    return res.status(201).json(tx);
  } else {
    throw new ApiError("error/transaction-error", "Ref code is wrong");
  }
};

const createReturn = async (req: Request, res: Response) => {
  const {order_id, user_id, total_price} = req.body;
  const card = await cardRepository.findOne(user_id);
  const job = await Worker.returnQueue.createJob({ card, total_price, order_id })
    .setId(`card ${card.id}`)
    .save();
  return res.json({
    message: `Processing the transaction with job ${job.id}. Please check it again!`
  })
  // const resp = await BriHelper.transfer("888801000157508", card.card_number, total_price, `20190329007JE${order_id}`);
  // if (resp.responseCode === "0200") {
  //   const newTx = await txRepository.create({
  //     from: 0,
  //     to: card.user_id,
  //     ref_code: "20190329007JE",
  //     type: TransactionType.RETURN
  //   });
  //   await txRepository.save(newTx);
  //   return res.json(newTx);
  // } else {
  //   throw new ApiError("error/transaction-error", "Failed to return");
  // }
};

const createReceive = async (req: Request, res: Response) => {
  const {order_id, user_id, total_price} = req.body;
  const card = await cardRepository.findOne(user_id);
  const job = await Worker.receiveQueue.createJob({ card, total_price, order_id })
    .setId(`card ${card.id}`)
    .save();
  return res.json({
    message: `Processing the transaction with job ${job.id}. Please check it again!`
  })
};

const getTransaction = async (req: Request, res: Response) => {
  const {user_id} = req.query;
  const txs = await txRepository.find({
    where: [
      {
        from: user_id
      },
      {
        to: user_id
      }
    ]
  });
  return res.json(txs);
};

export {
  createPayment, createReturn, createReceive, getTransaction
}
