import BaseModel from "./BaseModel";
import {Column, Entity} from "typeorm";

export enum TransactionType {
  PAYMENT = "payment",
  RETURN = "return",
  RECEIVE = "receive"
}

@Entity("transactions")
export class Transaction extends BaseModel {

  @Column({ type: "integer", default: 0 })
  to: number;

  @Column({ type: "integer", default: 0 })
  from: number;

  @Column({ type: "enum", enum: TransactionType })
  type: TransactionType;

  @Column({ type: "varchar" })
  ref_code: string;

}
