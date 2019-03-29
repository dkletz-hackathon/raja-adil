import cardRouter from "./card";
import {Router} from "express";

const router = Router();
router.use("/card", cardRouter.router);

export default router;
