import cardRouter from "./card";
import transactionRouter from "./transaction";
import {Router} from "express";

const router = Router();
router.use("/card", cardRouter.router);
router.use("/transaction", transactionRouter.router);

export default router;
