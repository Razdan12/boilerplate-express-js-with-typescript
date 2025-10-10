import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import FormPageController from "./formpage.controller.js";
import FormPageValidator from "./formpage.validator.js";
import { baseValidator } from "../../base/validator.base.js";

const r = Router(),
  validator = FormPageValidator,
  controller = new FormPageController();

r.get(
  "/find-all",
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get("/find-one/:id", controller.findById);

r.post(
  "/create",
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.patch(
  "/update/:id",
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", controller.delete);

const formpageRouter = r;
export default formpageRouter;
