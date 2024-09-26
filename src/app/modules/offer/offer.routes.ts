import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { OfferController } from "./offer.controller";
const router = express.Router();

router.get("/offer-history", auth(USER_ROLES.USER), OfferController.offerHistory)

router
  .route('/')
  .post(auth(USER_ROLES.USER), OfferController.createOffer)
  .get(auth(USER_ROLES.USER), OfferController.getOffer)

router
  .route('/:id')
  .patch(auth(USER_ROLES.USER), OfferController.respondOffer)
  .get(auth(USER_ROLES.USER), OfferController.getOfferDetails)


export const OfferRouter = router;