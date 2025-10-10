import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';
import FileManager from '../../lib/file-manager/index.js';

class AttachmentService extends BaseService {
  #fileManager;

  constructor() {
    super(prisma);
    this.#fileManager = new FileManager();
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.attachment.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.attachment.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.attachment.findUniqueOrThrow({
      where: { id },
      include: {
        candidate: {
          select: { id: true, fullName: true, userId: true },
        },
        schedule: {
          select: { id: true, title: true, startDate: true },
        },
      },
    });
    return data;
  };

  create = async (payload) => {
    const { file, ...restPayload } = payload;

    const filePath = await this.#fileManager.putFile(
      'uploads',
      'attachments',
      file
    );
    const data = await this.db.attachment.create({
      data: { filePath, ...restPayload },
    });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.attachment.delete({ where: { id } });
    await this.#fileManager.deleteFile(data.filePath);
    return data;
  };
}

export default AttachmentService;
