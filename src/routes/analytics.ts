import { Router } from "express";
import { analyticsSummary } from "../controllers/analytics";

const router = Router();

router.get("/summary", analyticsSummary);

export default router;