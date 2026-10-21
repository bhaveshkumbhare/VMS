import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { createBusiness } from "../controllers/business.controller";

const router = Router();
router.post("/", requireAuth, createBusiness);
export default router;