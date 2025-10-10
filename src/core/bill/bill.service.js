import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';

class BillService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.bill.findMany({
      ...q,
      include: {
        ref: {
          select: {
            id: true,
            title: true,
            type: true,
            eduLevel: true,
            studentType: true,
          },
        },
        candidate: {
          select: {
            id: true,
            fullName: true,
          },
        },
        payment: {
          select: {
            id: true,
            status: true,
            method: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (query.paginate) {
      const countData = await this.db.bill.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.bill.findUniqueOrThrow({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.bill.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.bill.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.bill.delete({ where: { id } });
    return data;
  };
}

export default BillService;
