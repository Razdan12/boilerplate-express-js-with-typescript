import BaseController from "../../base/controller.base.js";
import PaymentRefService from "./paymentref.service.js";

class PaymentRefController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new PaymentRefService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, "PaymentRef list retrieved");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    return this.success(res, data, "PaymentRef retrieved");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, "PaymentRef created");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, "PaymentRef updated");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "PaymentRef deleted");
  });
}

export default PaymentRefController;
