import BaseService from "../../base/service.base.js";
import { prisma } from "../../db/prisma.js";

class FormPageService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.formPage.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.formPage.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.formPage.findUniqueOrThrow({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.formPage.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.formPage.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.formPage.delete({ where: { id } });
    return data;
  };
}

export default FormPageService;  
