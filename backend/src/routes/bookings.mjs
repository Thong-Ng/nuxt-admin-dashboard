import { Router } from "express";
import { query, validationResult, matchedData, checkSchema } from "express-validator";
import { createBookingValidationSchema } from "../utils/validationSchema.mjs";

import BookingsController from "../controllers/bookingsController.mjs";
import { isAuthenticated } from "../middlewares/auth.mjs";
import "../strategies/jwt-strategy.mjs";

const router = Router();

router.use(isAuthenticated);

//get list of bookings
router.get("/api/bookings", async (req, res) => {
  const bookings = await BookingsController.getBookings(req, res);
});

//create booking
router.post("/api/bookings", checkSchema(createBookingValidationSchema), async (req, res) => {
  const bookingId = await BookingsController.createBooking(req, res);
});
//chekc availability
router.get("/api/bookings/check", async (req, res) => {
  console.log("check availability");
  const booking = await BookingsController.checkAvailability(req, res);
});
//get booking by id
router.get("/api/bookings/:id", async (req, res) => {
  const booking = await BookingsController.getBookingById(req, res);
});

//update booking
router.put("/api/bookings/:id", async (req, res) => {
  const updatedBooking = await BookingsController.updateBooking(req, res);
});

//delete booking by id
router.delete("/api/bookings/:id", async (req, res) => {
  const booking = await BookingsController.deleteBooking(req, res);
});

export default router;
