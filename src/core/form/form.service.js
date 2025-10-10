import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';

class FormService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.form.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.form.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.form.findUniqueOrThrow({
      where: { id },
      include: {
        pages: {
          include: {
            questions: {
              include: { options: true },
              orderBy: { order: 'asc' },
            },
            _count: {
              select: { questions: true },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { responses: true, pages: true },
        },
      },
    });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.form.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.form.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.form.delete({ where: { id } });
    return data;
  };
}

export default FormService;
