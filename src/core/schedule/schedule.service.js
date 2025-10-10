import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';

class ScheduleService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.schedule.findMany({
      ...q,
      include: {
        candidate: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (query.paginate) {
      const countData = await this.db.schedule.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.schedule.findUniqueOrThrow({
      where: { id },
      include: {
        candidate: {
          select: {
            id: true,
            fullName: true,
            eduClass: true,
            eduLevel: true,
            status: true,
            userId: true,
          },
        },
      },
    });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.schedule.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.schedule.update({
      where: { id },
      data: payload,
    });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.schedule.delete({ where: { id } });
    return data;
  };
}

export default ScheduleService;
