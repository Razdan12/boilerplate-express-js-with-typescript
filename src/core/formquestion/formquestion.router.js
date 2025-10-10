import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import FormQuestionController from "./formquestion.controller.js";
import FormQuestionValidator from "./formquestion.validator.js";
import { baseValidator } from "../../base/validator.base.js";

const r = Router(),
  validator = FormQuestionValidator,
  controller = new FormQuestionController();

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

const formquestionRouter = r;
export default formquestionRouter;
