const { Router } = require("express");
const userRouter = Router();
const userController = require("./user.controller");
userRouter.post(
  "/register",
  userController.validateCreateUser,
  userController.createUser
);
userRouter.post(
  "/login",
  userController.validateLoginUser,
  userController.loginUser
);
userRouter.post("/logout", userController.authorize, userController.logout);
userRouter.get(
  "/current",
  userController.authorize,
  userController.getCurrentUser
);
module.exports = userRouter;
