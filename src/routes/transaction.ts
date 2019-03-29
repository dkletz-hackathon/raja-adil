import ApiRouter from "./ApiRouter";
import * as TransactionController from "../controllers/TransactionController";

const router = new ApiRouter();
router.post("/payment", TransactionController.createPayment);

export default router;
