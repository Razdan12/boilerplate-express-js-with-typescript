import BaseController from '../../base/controller.base.js';
import FileManager from '../../lib/file-manager/index.js';
import FormResponseService from './formresponse.service.js';
import { FormResponseStatus } from './formresponse.validator.js';

class FormResponseController extends BaseController {
  #service;
  #fileManager;

  constructor() {
    super();
    this.#service = new FormResponseService();
    this.#fileManager = new FileManager();
  }

  export = this.wrapper(async (req, res) => {
    if (this.isUser(req))
      await this.#service.hasAccess(req.params.id, req.user.id, true);

    const result = await this.#service.export(req.params.id);
    const zip = await this.#fileManager.zipFiles(null, [
      {
        data: result.pdf,
        name: `Respon.pdf`,
      },
      ...result.attachments.map((att) => ({
        data: att.data,
        name: att.name,
        fromDisk: true,
      })),
    ]);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${[
        result.data.form?.title ?? 'Formulir',
        result.data.candidate?.fullName ?? '',
      ]
        .filter(Boolean)
        .join(' ')}.zip"`
    );
    res.send(zip);
  });

  downloadFile = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);

    if (
      req.user.roleCode === 'USR' &&
      (data.candidate.userId ?? null) !== req.user.id
    )
      throw new Forbidden();

    const ans = data.answers.find((a) => a.id == req.params.answerId);

    return res.download(ans.ansText);
  });

  findAll = this.wrapper(async (req, res) => {
    if (req.user.roleCode == 'USR')
      req.vquery = this.joinFindAllQuery(
        req.vquery,
        'where',
        `candidate.userId:${req.user.id}`
      );

    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, 'Banyak FormResponse berhasil didapatkan ');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (
      req.user.roleCode === 'USR' &&
      (data.candidate.userId ?? null) !== req.user.id
    )
      throw new Forbidden();

    return this.success(res, data, 'FormResponse berhasil didapatkan');
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, 'FormResponse berhasil dibuat');
  });

  update = this.wrapper(async (req, res) => {
    await this.#service.hasAccess(req.params.id, req.user.id);

    // if (req.vbody.status == FormResponseStatus.SUBMITTED)
    // TODO validation by rules

    const data = await this.#service.update(
      req.params.id,
      req.vbody,
      req.files
    );
    return this.success(res, data, 'FormResponse berhasil diperbarui');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'FormResponse berhasil dihapus');
  });
}

export default FormResponseController;
