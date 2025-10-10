import BaseController from '../../base/controller.base.js';
import {
  BadRequest,
  Forbidden,
} from '../../middlewares/exception.middleware.js';
import ScheduleService from './schedule.service.js';

class ScheduleController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new ScheduleService();
  }

  findAll = this.wrapper(async (req, res) => {
    if (req.user.roleCode == 'USR')
      req.vquery = this.joinFindAllQuery(
        req.vquery,
        'where',
        `candidate.userId:${req.user.id}`
      );

    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, 'Schedule list retrieved');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (req.user.roleCode == 'USR' && data.candidate.userId != req.user.id)
      throw new Forbidden();
    return this.success(res, data, 'Schedule retrieved');
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, 'Schedule created');
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, 'Schedule updated');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'Schedule deleted');
  });
}

export default ScheduleController;
