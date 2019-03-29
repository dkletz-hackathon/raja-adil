import {AfterLoad, BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn,} from "typeorm";
import * as moment from 'moment-timezone';

abstract class BaseModel {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "timestamp with time zone"})
  created_at: Date | string;

  @Column({type: "timestamp with time zone"})
  updated_at: Date | string;

  /**
   * Only for Postgres and not mysql!
   * In postgres there is timestamp with timezone with default format: YYYY-MM-DD HH:mm:ssZ
   */
  @BeforeInsert()
  saveDates() {
    this.created_at = moment(new Date()).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss+07");
    this.updated_at = moment(new Date()).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss+07");
  }

  /**
   * Same for saveDates()
   */
  @BeforeUpdate()
  updateDate() {
    this.updated_at = moment(new Date()).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ssZ");
  }

  /**
   * Same for saveDates()
   */
  @AfterLoad()
  setTimezoneDate() {
    this.created_at = moment(this.created_at).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ssZ");
    this.updated_at = moment(this.created_at).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ssZ");
  }

}

export default BaseModel;
