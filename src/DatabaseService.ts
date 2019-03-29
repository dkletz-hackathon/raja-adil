import {Connection, createConnection} from "typeorm";
import "reflect-metadata";

class DatabaseService {

  private static conn: Connection;

  static async getConnection() {
    if (this.conn == null) {
      this.conn = await createConnection();
    }
    return this.conn;
  }
}

export default DatabaseService;