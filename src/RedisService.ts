import * as redis from "redis";

class RedisService {

  private static client;

  static createClient() {
    this.client = redis.createClient("./data/redis.sock");
  }

  static getClient() {
    return this.client;
  }

}

export default RedisService;


