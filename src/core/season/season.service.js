import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';
import { toSlug } from '../../utils/string.js';
import { isUUID } from '../../utils/type.js';

class SeasonService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.season.findMany({
      ...q,
      include: {
        _count: { select: { candidates: true } },
      },
    });

    if (query.paginate) {
      const countData = await this.db.season.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const where = isUUID(id) ? { id } : { slug: id };
    const data = await this.db.season.findUniqueOrThrow({ where });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.season.create({
      data: { ...payload, slug: toSlug(payload.title) },
    });
    return data;
  };

  update = async (id, payload) => {
    if (payload.isActive) await this.updateAllActive(false);
    if (payload.title) payload.slug = toSlug(payload.title);
    const data = await this.db.season.update({ where: { id }, data: payload });
    return data;
  };

  updateAllActive = async (active = false) => {
    await this.db.season.updateMany({ data: { isActive: active } });
  };

  delete = async (id) => {
    const data = await this.db.season.delete({ where: { id } });
    return data;
  };
}

export default SeasonService;
