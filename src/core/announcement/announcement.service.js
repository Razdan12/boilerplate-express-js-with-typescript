import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';

class AnnouncementService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.announcement.findMany({
      ...q,
      select: {
        id: true,
        title: true,
        type: true,
        desc: true,
        _count: { select: { candidates: true } },
      },
    });

    if (query.paginate) {
      const countData = await this.db.announcement.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.announcement.findUniqueOrThrow({
      where: { id },
      include: {
        candidates: {
          select: {
            userId: true,
            fullName: true,
            eduClass: true,
            eduLevel: true,
          },
        },
      },
    });
    return data;
  };

  create = async (payload) => {
    const { candidateIds = [], ...restPayload } = payload;
    const data = await this.db.announcement.create({
      data: {
        ...restPayload,
        candidates: {
          connect: candidateIds.map((id) => ({ id })),
        },
      },
    });
    return data;
  };

  update = async (id, payload) => {
    const { candidateIds, ...restPayload } = payload;
    const data = await this.db.announcement.update({
      where: { id },
      data: {
        ...restPayload,
        ...(candidateIds && {
          candidates: {
            set: candidateIds.map((id) => ({ id })),
          },
        }),
      },
    });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.announcement.delete({ where: { id } });
    return data;
  };
}

export default AnnouncementService;
