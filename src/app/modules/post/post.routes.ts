import express from 'express'
import { USER_ROLES } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { PostController } from './post.controller'
import { PostValidation } from './post.validation'
import fileUploadHandler from '../../middlewares/fileUploadHandler'
const router = express.Router()

router.post("/create",
    auth(USER_ROLES.USER),
    fileUploadHandler(),
    validateRequest(PostValidation.createPostZodSchema), 
    PostController.createPost
)

router.patch("/update-post", 
    auth(USER_ROLES.USER),
    fileUploadHandler(),
    validateRequest(PostValidation.updatePostZodSchema), 
    PostController.updatePost
)

router.get("/popular", auth(USER_ROLES.USER), PostController.popularService);
router.get("/recommended", auth(USER_ROLES.USER), PostController.recommendedService);
router.get("/my-service", auth(USER_ROLES.USER), PostController.myPostList);
router.get("/", auth(USER_ROLES.USER), PostController.serviceList);
router.get("/:id", auth(USER_ROLES.USER), PostController.serviceDetails);
router.delete("/delete/:id", auth(USER_ROLES.USER), PostController.updatePost);

export const PostRoutes = router