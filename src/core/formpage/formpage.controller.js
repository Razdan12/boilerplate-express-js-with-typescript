import BaseController from "../../base/controller.base.js";
import FormPageService from "./formpage.service.js";

class FormPageController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new FormPageService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, "Banyak FormPage berhasil didapatkan ");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    return this.success(res, data, "FormPage berhasil didapatkan");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, "FormPage berhasil dibuat");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, "FormPage berhasil diperbarui");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "FormPage berhasil dihapus");
  });
}

export default FormPageController;
