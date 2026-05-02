import { Router, type IRouter } from "express";
import healthRouter from "./health";
import transactionsRouter from "./transactions";
import goalsRouter from "./goals";
import cardsRouter from "./cards";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(transactionsRouter);
router.use(goalsRouter);
router.use(cardsRouter);
router.use(dashboardRouter);

export default router;
