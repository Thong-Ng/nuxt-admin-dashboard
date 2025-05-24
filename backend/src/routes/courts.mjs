import { Router } from "express";
import { query, validationResult, matchedData, checkSchema } from "express-validator";
import { createCourtValidationSchema, updateCourtValidationSchema } from "../utils/validationSchema.mjs";

import CourtsController from "../controllers/courtsController.mjs";
import { isAuthenticated } from "../middlewares/auth.mjs";
import "../strategies/jwt-strategy.mjs";

const router = Router();

router.use(isAuthenticated);

//get list of courts
router.get("/api/courts", async (req, res) => {
  const courts = await CourtsController.getCourts(req, res);
});

router.get("/api/parentCourts", async (req, res) => {
  const courts = await CourtsController.getParentCourts(req, res);
});

//create court
router.post("/api/courts", checkSchema(createCourtValidationSchema), async (req, res) => {
  const courtId = await CourtsController.createCourt(req, res);
});

//get court by id
router.get("/api/courts/:id", async (req, res) => {
  const court = await CourtsController.getCourtById(req, res);
});
//update court
router.put("/api/courts/:id", checkSchema(updateCourtValidationSchema), async (req, res) => {
  const updatedCourt = await CourtsController.updateCourt(req, res);
});

//delete court by id
router.delete("/api/courts/:id", async (req, res) => {
  const court = await CourtsController.deleteCourt(req, res);
});

export default router;