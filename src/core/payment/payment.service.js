import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';
import FileManager from '../../lib/file-manager/index.js';
import { BadRequest } from '../../middlewares/exception.middleware.js';
import { PaymentMethod, PaymentStatus } from './payment.validator.js';

class PaymentService extends BaseService {
  #fileManager;

  constructor() {
    super(prisma);
    this.#fileManager = new FileManager();
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.payment.findMany({
      ...q,
      include: {
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
      const countData = await this.db.payment.count({
        where: q.where,
      });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.payment.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        bills: {
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
          },
        },
      },
    });
    return data;
  };

  create = async (user, file, payload) => {
    const { billIds } = payload;

    const bills = await this.db.bill.findMany({
      where: {
        id: { in: billIds },
        userId: user.id,
        paymentId: null,
      },
    });
    if (bills.length != billIds.length)
      throw new BadRequest('Terdapat tagihan yang sudah dibayar');

    let proofPath = undefined;
    if (file)
      proofPath = await this.#fileManager.putFile(
        'uploads',
        'payment-proofs',
        file
      );

    const data = await this.db.payment.create({
      data: {
        userId: user.id,
        title: 'Pembayaran',
        status: PaymentStatus.PENDING,
        amount: bills.reduce((a, c) => a + c.quantity * c.amount, 0),
        method: PaymentMethod.MANUAL_TRANSFER,
        proofPath: proofPath,
        bills: {
          connect: billIds.map((id) => ({ id })),
        },
      },
    });

    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.payment.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.payment.delete({ where: { id } });
    return data;
  };
}

export default PaymentService;
