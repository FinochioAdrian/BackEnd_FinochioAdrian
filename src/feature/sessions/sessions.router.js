import Router from "express";
import sessionsController from "./sessions.controller.js";

import { passportCall, auth } from "../../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passportCall("register", {
    failureRedirect: "/register",
    failureFlash: true,
  }),
  sessionsController.register
);

router.post(
  "/login",
  passportCall("local-login", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  sessionsController.login
);

router.post("/forgotEmailAndPassword", sessionsController.forgotEmailAndPassword);

router.post("/password-reset", sessionsController.passwordReset);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureFlash: true,
    session: false,
  }),
  sessionsController.githubcallback
);

router.get("/logout",passportCall("jwt"), auth(["user","premium","admin"]), sessionsController.logout);

router.get("/failregister", sessionsController.failRegister);

router.get("/failLogin", sessionsController.failLogin);

router.get("/current", passportCall("jwt"), auth(["user","premium","admin"]), sessionsController.current);

export default router;
