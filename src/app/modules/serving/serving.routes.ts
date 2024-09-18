import express from 'express'
import { USER_ROLES } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { ServingController } from './serving.controller'
import { ServingValidation } from './serving.validation'
import fileUploadHandler from '../../middlewares/fileUploadHandler'
const router = express.Router()

router.post("/create",
    auth(USER_ROLES.USER),
    fileUploadHandler(),
    validateRequest(ServingValidation.createServingZodSchema), 
    ServingController.createServing
)

router.patch("/update-serving", 
    auth(USER_ROLES.USER),
    fileUploadHandler(),
    validateRequest(ServingValidation.updateServingZodSchema), 
    ServingController.updateServing
)

router.get("/", auth(USER_ROLES.USER), ServingController.servingList)
router.delete("/delete/:id", auth(USER_ROLES.USER), ServingController.updateServing)

export const ServingRoutes = router