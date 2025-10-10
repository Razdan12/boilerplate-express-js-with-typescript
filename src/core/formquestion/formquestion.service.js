import BaseService from "../../base/service.base.js";
import { prisma } from "../../db/prisma.js";

class FormQuestionService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.formQuestion.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.formQuestion.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.formQuestion.findUniqueOrThrow({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.formQuestion.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.formQuestion.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.formQuestion.delete({ where: { id } });
    return data;
  };
}

export default FormQuestionService;  
