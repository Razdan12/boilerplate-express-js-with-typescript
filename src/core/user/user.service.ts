import BaseService from '../../base/service.base';
import prisma from '../../config/prisma.db';

class UserService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query: any) => {
    const q = this.transformBrowseQuery(query);
    const data = await (this.db as any).user.findMany({ ...q });

    if (query.paginate) {
      const count = await (this.db as any).user.count({ where: q.where });
      return this.paginate(data, count, q);
    }
    return data;
  };

  findById = async (id: number) => {
    return (this.db as any).user.findUnique({ where: { id } });
  };

  create = async (payload: any) => {
    return (this.db as any).user.create({ data: payload });
  };

  update = async (id: number, payload: any) => {
    return (this.db as any).user.update({ where: { id }, data: payload });
  };

  delete = async (id: number) => {
    return (this.db as any).user.delete({ where: { id } });
  };
}

export default UserService;
