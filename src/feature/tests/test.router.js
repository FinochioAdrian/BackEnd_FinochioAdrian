import { Router } from 'express';
import testsController from "./test.controller.js";


const router = new Router();

router.get("/",testsController.loggerTest)
/* router.get("/mail/:emailToSend",testsController.sendMail) */



export default router;