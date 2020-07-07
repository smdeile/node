const { Router } = require("express");
const userRouter = Router();
const contactController = require("./contacts.controller");
userRouter.get("/", contactController.getContacts);
userRouter.post(
  "/",
  contactController.validateCreateContact,
  contactController.createContact
);
userRouter.put(
  "/:contactId",
  contactController.validateUpdateContact,
  contactController.updateContact
);
userRouter.get("/:contactId", contactController.getById);
userRouter.delete("/:contactId", contactController.removeContact);

module.exports = userRouter;
