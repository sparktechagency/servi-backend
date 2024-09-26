import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { OfferController } from "./offer.controller";
const router = express.Router();


router.post("/", auth(USER_ROLES.USER), OfferController.createOffer);
router.get("/", auth(USER_ROLES.USER), OfferController.getOffer);
router.patch("/:id", auth(USER_ROLES.USER), OfferController.respondOffer);
router.get("/:id", auth(USER_ROLES.USER), OfferController.getOfferDetails);


export const OfferRouter = router;