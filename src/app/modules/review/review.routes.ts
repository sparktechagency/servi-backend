import express  from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import { ReviewController } from "./review.controller";
const router = express.Router();



router.post("/", auth(USER_ROLES.USER), fileUploadHandler(), ReviewController.createReview);
router.get("/:id", auth(USER_ROLES.USER), ReviewController.getReview);

export const ReviewRoutes = router;