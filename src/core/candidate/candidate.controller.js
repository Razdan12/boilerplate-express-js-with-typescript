import BaseController from '../../base/controller.base.js';
import {
  BadRequest,
  Forbidden,
  NotFound,
} from '../../middlewares/exception.middleware.js';
import AnnouncementService from '../announcement/announcement.service.js';
import { AnnouncementType } from '../announcement/announcement.validator.js';
import CandidateService from './candidate.service.js';
import { CandidateStatus } from './candidate.validator.js';

class CandidateController extends BaseController {
  #service;
  #announcementService;

  constructor() {
    super();
    this.#service = new CandidateService();
    this.#announcementService = new AnnouncementService();
  }

  stats = this.wrapper(async (req, res) => {
    const data = await this.#service.stats(req.vquery);
    return this.success(res, data, 'Berhasil');
  });

  downloadPhoto = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);

    if (req.user.roleCode === 'USR' && (data.userId ?? null) !== req.user.id)
      throw new Forbidden();

    if (!data.photoPath) throw new NotFound();

    return res.download(data.photoPath);
  });

  findAll = this.wrapper(async (req, res) => {
    if (req.user.roleCode == 'USR')
      req.vquery = this.joinFindAllQuery(
        req.vquery,
        'where',
        `userId:${req.user.id}`
      );

    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, 'Candidate list retrieved');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);

    if (req.user.roleCode === 'USR' && (data.userId ?? null) !== req.user.id)
      throw new Forbidden();

    return this.success(res, data, 'Candidate retrieved');
  });

  create = this.wrapper(async (req, res) => {
    req.vbody.status = CandidateStatus.ENROLL;
    req.vbody.userId = req.user.id;
    const data = await this.#service.create(req.user, req.vbody);
    return this.created(res, data, 'Candidate created');
  });

  update = this.wrapper(async (req, res) => {
    if (req.user.roleCode === 'USR')
      await this.#service.hasAccess(req.user.id, req.params.id);

    req.vbody.photo = req.file;
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, 'Candidate updated');
  });

  acceptanceUser = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (
      data.userId != req.user.id ||
      data.status != CandidateStatus.PASSED_TEST
    )
      throw new Forbidden();

    await this.#service.createFullPaymentBills(req.params.id);
    await this.#service.update(req.params.id, req.vbody);
    return this.success(res, null, 'Candidate updated');
  });

  acceptanceAdmin = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (
      data.status != CandidateStatus.WALK_IN &&
      !data.bills.every((b) => b.payment)
    )
      throw new BadRequest('Kandidat belum memenuhi syarat');

    await this.#service.update(req.params.id, req.vbody);
    await this.#announcementService.create({
      candidateIds: [data.id],
      type:
        req.vbody.status == CandidateStatus.ACCEPTED
          ? AnnouncementType.SUCCESS
          : AnnouncementType.ERROR,
      title:
        req.vbody.status == CandidateStatus.ACCEPTED
          ? 'Selamat, Ananda Dinyatakan Diterima'
          : 'Maaf, Ananda belum diterima',
      desc:
        req.vbody.status == CandidateStatus.ACCEPTED
          ? 'Ananda dinyatakan diterima sebagai siswa. Nantikan pengumuman selanjutnya.'
          : 'Terima kasih telah mengikuti seleksi. Ananda belum diterima saat ini.',
    });
    return this.success(res, null, 'Candidate updated');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'Candidate deleted');
  });
}

export default CandidateController;
