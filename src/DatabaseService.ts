import {Connection, createConnection} from "typeorm";
import "reflect-metadata";

class DatabaseService {

  private static conn: Connection;

  static async createConnection() {
    if (this.conn == null) {
      this.conn = await createConnection();
    }
    return this.conn;
  }

  static getConnection() {
    return this.conn;
  }

}

export default DatabaseService;
