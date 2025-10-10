import BaseController from '../../base/controller.base.js';
import BillService from './bill.service.js';

class BillController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new BillService();
  }

  findAll = this.wrapper(async (req, res) => {
    if (req.user.roleCode == 'USR')
      req.vquery = this.joinFindAllQuery(
        req.vquery,
        'where',
        `userId:${req.user.id}`
      );

    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, 'Banyak Bill berhasil didapatkan ');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);

    if (req.user.roleCode === 'USR' && (data.userId ?? null) !== req.user.id)
      throw new Forbidden();

    return this.success(res, data, 'Bill berhasil didapatkan');
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, 'Bill berhasil dibuat');
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, 'Bill berhasil diperbarui');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'Bill berhasil dihapus');
  });
}

export default BillController;
