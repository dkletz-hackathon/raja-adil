import {Transaction, TransactionType} from "../models/Transaction";
import * as BriHelper from "../helpers/BriHelper";
import {Request, Response} from "express";
import DatabaseService from "../DatabaseService";
import ApiError from "../ApiError";

const txRepository = DatabaseService.getConnection().getRepository(Transaction);

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
    return res.status(201).json(tx);
  } else {
    throw new ApiError("error/transaction-error", "Ref code is wrong");
  }
};

export {
  createPayment
}
