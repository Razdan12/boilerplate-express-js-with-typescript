import BaseController from "../../base/controller.base.js";
import SeasonService from "./season.service.js";

class SeasonController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new SeasonService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, "Season list retrieved");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    return this.success(res, data, "Season retrieved");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, "Season created");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, "Season updated");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "Season deleted");
  });
}

export default SeasonController;
