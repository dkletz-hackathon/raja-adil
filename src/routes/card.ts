import ApiRouter from "./ApiRouter";
import * as CardController from "../controllers/CardController";

const router = new ApiRouter();
router.resource(CardController);
router.executeResource();

export default router;
