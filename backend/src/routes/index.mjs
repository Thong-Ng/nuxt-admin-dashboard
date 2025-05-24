import { Router } from "express";
import usersRouter from "./users.mjs";
import courtsRouter from "./courts.mjs";
import bookingsRouter from "./bookings.mjs";


const router = Router();

router.use(usersRouter);
router.use(courtsRouter);
router.use(bookingsRouter);

export default router;