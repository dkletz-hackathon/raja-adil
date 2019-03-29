import {Column, Entity} from "typeorm";
import BaseModel from "./BaseModel";

@Entity("cards")
export class Card extends BaseModel {

  @Column({ type: "integer" })
  user_id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  card_number: string;

}

