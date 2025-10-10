import BaseController from '../../base/controller.base.js';
import { BadRequest } from '../../middlewares/exception.middleware.js';
import AttachmentService from './attachment.service.js';

class AttachmentController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new AttachmentService();
  }

  downloadFile = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);

    if (
      req.user.roleCode === 'USR' &&
      (data.candidate.userId ?? null) !== req.user.id
    )
      throw new Forbidden();

    return res.download(data.filePath);
  });

  findAll = this.wrapper(async (req, res) => {
    if (req.user.roleCode == 'USR')
      req.vquery = this.joinFindAllQuery(
        req.vquery,
        'where',
        `candidate.userId:${req.user.id}`
      );

    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, 'Banyak Attachment berhasil didapatkan ');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(+req.params.id);
    if (
      req.user.roleCode === 'USR' &&
      (data.candidate.userId ?? null) !== req.user.id
    )
      throw new Forbidden();

    return this.success(res, data, 'Attachment berhasil didapatkan');
  });

  create = this.wrapper(async (req, res) => {
    if (!req.file) throw new BadRequest('Wajib mengunggah dokumen');
    req.vbody.file = req.file;
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, 'Attachment berhasil dibuat');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(+req.params.id);
    return this.noContent(res, 'Attachment berhasil dihapus');
  });
}

export default AttachmentController;
