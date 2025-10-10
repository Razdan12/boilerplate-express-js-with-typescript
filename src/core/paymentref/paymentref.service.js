import BaseService from "../../base/service.base.js";
import { prisma } from "../../db/prisma.js";

class PaymentRefService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.paymentRef.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.paymentRef.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.paymentRef.findUniqueOrThrow({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.paymentRef.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.paymentRef.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.paymentRef.delete({ where: { id } });
    return data;
  };
}

export default PaymentRefService;  
