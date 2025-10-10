import BaseController from '../../base/controller.base.js';
import {
  BadRequest,
  NotFound,
} from '../../middlewares/exception.middleware.js';
import PaymentService from './payment.service.js';
import { PaymentMethod } from './payment.validator.js';

class PaymentController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new PaymentService();
  }

  downloadProof = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);

    if (req.user.roleCode === 'USR' && (data.userId ?? null) !== req.user.id)
      throw new Forbidden();

    if (!data.proofPath) throw new NotFound();

    return res.download(data.proofPath);
  });

  findAll = this.wrapper(async (req, res) => {
    if (req.user.roleCode == 'USR')
      req.vquery = this.joinFindAllQuery(
        req.vquery,
        'where',
        `userId:${req.user.id}`
      );

    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, 'Payment list retrieved');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);

    if (req.user.roleCode === 'USR' && (data.userId ?? null) !== req.user.id)
      throw new Forbidden();

    return this.success(res, data, 'Payment retrieved');
  });

  create = this.wrapper(async (req, res) => {
    if (!req.file && req.vbody.method == PaymentMethod.MANUAL_TRANSFER)
      throw new BadRequest(
        'Pembayaran transfer manual wajib menyertakan bukti transfer'
      );

    const data = await this.#service.create(req.user, req.file, req.vbody);
    return this.created(res, data, 'Payment created');
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, 'Payment updated');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'Payment deleted');
  });
}

export default PaymentController;
