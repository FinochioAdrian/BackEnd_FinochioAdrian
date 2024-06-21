import express from "express";
import * as UsersController from "./users.controller.js";
import userValidationMiddleware, { runValidation } from "./userValidationMiddleware.js";
import { passportCall, auth } from "../../utils.js";
import { uploadDocuments } from "../../utils/upload.middleware.js";
import envConfig from "../../config/config.js";

const router = express.Router();


router.put("/premium/:uid",  userValidationMiddleware("isID"), runValidation,passportCall("jwt"), auth(["user", "premium", "admin"]), UsersController.switchUserRole);
router.post("/:uid/documents", passportCall("jwt"), auth(["user", "premium", "admin"]), uploadDocuments.fields([{ name: 'identification', maxCount: 1 }, { name: 'accountStatement', maxCount: 1 }, { name: 'proofOfResidence', maxCount: 1 }]), UsersController.setDocuments)
export default router;
