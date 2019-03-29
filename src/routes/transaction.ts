import ApiRouter from "./ApiRouter";
import * as TransactionController from "../controllers/TransactionController";

const router = new ApiRouter();
router.post("/payment", TransactionController.createPayment);
router.post("/return", TransactionController.createReturn);
router.post("/receive", TransactionController.createReceive);

export default router;
