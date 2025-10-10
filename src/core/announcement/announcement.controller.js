import BaseController from '../../base/controller.base.js';
import CandidateService from '../candidate/candidate.service.js';
import AnnouncementService from './announcement.service.js';

class AnnouncementController extends BaseController {
  #service;
  #candidateService;

  constructor() {
    super();
    this.#service = new AnnouncementService();
    this.#candidateService = new CandidateService();
  }

  findAll = this.wrapper(async (req, res) => {
    if (req.user.roleCode == 'USR')
      req.vquery = this.joinFindAllQuery(
        req.vquery,
        'where',
        `candidates.some.userId:${req.user.id}`
      );

    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, 'Announcement list retrieved');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (
      req.user.roleCode == 'USR' &&
      !data.candidates.some((c) => c.userId == req.user.id)
    )
      throw new Forbidden();

    if (req.user.roleCode == 'USR')
      data.candidates = data.candidates.filter((c) => c.userId == req.user.id);

    return this.success(res, data, 'Announcement retrieved');
  });

  create = this.wrapper(async (req, res) => {
    const { candidateQuery, ...body } = req.vbody;
    if (candidateQuery) {
      const candidates = await this.#candidateService.findAll(candidateQuery);
      body.candidateIds = [
        ...(body.candidateIds ?? []),
        ...candidates.items.map((c) => c.id),
      ];
    }
    const data = await this.#service.create(body);
    return this.created(res, data, 'Announcement created');
  });

  update = this.wrapper(async (req, res) => {
    const { candidateQuery, ...body } = req.vbody;
    if (candidateQuery) {
      const candidates = await this.#candidateService.findAll(candidateQuery);
      body.candidateIds = [
        ...(body.candidateIds ?? []),
        ...candidates.items.map((c) => c.id),
      ];
    }
    const data = await this.#service.update(req.params.id, body);
    return this.success(res, data, 'Announcement updated');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'Announcement deleted');
  });
}

export default AnnouncementController;
