import express from "express"
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import { BookingController } from "./booking.controller";
const router = express.Router();

router.post("/", auth(USER_ROLES.USER), fileUploadHandler(), BookingController.createBooking)
router.get("/", auth(USER_ROLES.USER), BookingController.bookingDetails);
router.get("/who-booking", auth(USER_ROLES.USER), BookingController.whoBooking);
router.get("/my-booking", auth(USER_ROLES.USER), BookingController.myBooking);
router.get("/transaction-history", auth(USER_ROLES.USER), BookingController.transactionHistory);
router.patch("/:id", auth(USER_ROLES.USER), BookingController.respondBooking);

export const BookingRoutes = router;