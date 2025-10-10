import moment from 'moment';
import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';
import FileManager from '../../lib/file-manager/index.js';
import {
  BadRequest,
  Forbidden,
} from '../../middlewares/exception.middleware.js';
import { genDates } from '../../utils/date.js';
import { PaymentStatus } from '../payment/payment.validator.js';
import { PaymentRefType } from '../paymentref/paymentref.validator.js';
import { CandidateStatus } from './candidate.validator.js';

class CandidateService extends BaseService {
  #fileManager;

  constructor() {
    super(prisma);
    this.#fileManager = new FileManager();
  }

  stats = async (query) => {
    const q = this.transformFindAllQuery(query);

    const [earliest, latest] = await Promise.all([
      this.db.candidate.findFirst({
        where: q.where,
        orderBy: { createdAt: 'asc' },
      }),
      this.db.candidate.findFirst({
        where: q.where,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const dates =
      earliest && latest ? genDates(earliest.createdAt, latest.createdAt) : [];

    const allPerDay = [];
    for (let i = 0; i < dates.length; i += 7) {
      const datesBatch = dates.slice(i, i + 20);
      const allPerDayQueries = await Promise.all(
        datesBatch.map((d) =>
          this.db.candidate.count({
            where: {
              ...q.where,
              createdAt: {
                gte: d.clone().startOf('day').toDate(),
                lte: d.clone().endOf('day').toDate(),
              },
            },
          })
        )
      );

      datesBatch.forEach((d, idx) => {
        allPerDay.push({
          label: d.toDate(),
          value: allPerDayQueries[idx],
        });
      });
    }

    const [
      allTotal,
      allToday,
      statusTotal,
      genderTotal,
      eduLevelTotal,
      eduClassTotal,
      studentTypeTotal,
      pendingPaymentAmount,
      succeedPaymentAmount,
    ] = await Promise.all([
      this.db.candidate.count({ where: q.where }),

      this.db.candidate.count({
        where: {
          ...q.where,
          createdAt: {
            gte: moment().startOf('day').toDate(),
            lte: moment().endOf('day').toDate(),
          },
        },
      }),

      this.db.candidate.groupBy({
        by: ['status'],
        where: q.where,
        _count: { id: true },
      }),

      this.db.candidate.groupBy({
        by: ['gender'],
        where: q.where,
        _count: { id: true },
      }),

      this.db.candidate.groupBy({
        by: ['eduLevel'],
        where: q.where,
        _count: { id: true },
      }),

      this.db.candidate.groupBy({
        by: ['eduClass'],
        where: q.where,
        _count: { id: true },
      }),

      this.db.candidate.groupBy({
        by: ['studentType'],
        where: q.where,
        _count: { id: true },
      }),

      this.db.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: PaymentStatus.PENDING,
          bills: {
            every: { candidate: q.where },
          },
        },
      }),

      this.db.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: PaymentStatus.SUCCESS,
          bills: {
            every: { candidate: q.where },
          },
        },
      }),
    ]);

    return {
      all: {
        total: allTotal,
        today: allToday,
        perDay: allPerDay,
      },
      payment: {
        pending: pendingPaymentAmount['_sum']['amount'],
        succeed: succeedPaymentAmount['_sum']['amount'],
      },
      status: statusTotal.reduce((acc, curr) => {
        acc[curr.status] = curr._count.id;
        return acc;
      }, {}),
      gender: genderTotal.reduce((acc, curr) => {
        acc[curr.gender] = curr._count.id;
        return acc;
      }, {}),
      eduLevel: eduLevelTotal.reduce((acc, curr) => {
        acc[curr.eduLevel] = curr._count.id;
        return acc;
      }, {}),
      eduClass: eduClassTotal.reduce((acc, curr) => {
        acc[curr.eduClass] = curr._count.id;
        return acc;
      }, {}),
      studentType: studentTypeTotal.reduce((acc, curr) => {
        acc[curr.studentType] = curr._count.id;
        return acc;
      }, {}),
    };
  };

  createFullPaymentBills = async (id) => {
    const data = await this.db.candidate.findUniqueOrThrow({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
    });

    const paymentRefs = await this.db.paymentRef.findMany({
      where: {
        type: PaymentRefType.FULL_PAYMENT,
        eduLevel: data.eduLevel,
        OR: [{ studentType: data.studentType }, { studentType: '' }],
      },
    });

    await this.db.bill.createMany({
      data: paymentRefs.map((pr) => ({
        userId: data.userId,
        candidateId: data.id,
        refId: pr.id,
        fullName: data.user.fullName,
        email: data.user.email,
        title: pr.title,
        quantity: 1,
        amount: pr.amount,
      })),
    });
  };

  hasAccess = async (userId, id) => {
    const data = await this.db.candidate.findUnique({
      where: { id },
      select: { id: true, userId: true, status: true },
    });
    if (data.userId != userId) throw new Forbidden();
    if (data.status != CandidateStatus.ENROLL)
      throw new BadRequest('Data sudah tidak dapat diedit');
  };

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.candidate.findMany({
      ...q,
      select: {
        id: true,
        seasonId: true,
        userId: true,
        status: true,
        birthDate: true,
        fullName: true,
        eduLevel: true,
        eduClass: true,
        studentType: true,
        photoPath: true,
        bills: {
          select: { paymentId: true },
        },
        formResponses: {
          select: { status: true },
        },
        season: true,
      },
    });
    if (query.paginate) {
      const countData = await this.db.candidate.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.candidate.findUniqueOrThrow({
      where: { id },
      include: {
        bills: {
          select: {
            id: true,
            title: true,
            ref: {
              select: {
                id: true,
                type: true,
                title: true,
              },
            },
            payment: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
        formResponses: {
          select: {
            id: true,
            status: true,
            form: { select: { id: true, title: true } },
          },
          orderBy: {
            form: { title: 'asc' },
          },
        },
        season: true,
        schedules: {
          select: {
            id: true,
            title: true,
            startDate: true,
          },
        },
      },
    });
    return data;
  };

  create = async (user, payload) => {
    const season = await this.db.season.count({
      where: {
        id: payload.seasonId,
        isActive: true,
      },
    });

    if (!season)
      throw new BadRequest('Periode pendaftaran tidak dibuka atau sudah tutup');

    const forms = await this.db.form.findMany({
      where: { isActive: true },
    });

    const paymentRefs = await this.db.paymentRef.findMany({
      where: {
        type: PaymentRefType.INITIAL_PAYMENT,
        OR: [{ eduLevel: payload.eduLevel }, { eduLevel: '' }],
      },
    });

    if (!paymentRefs.length)
      throw new BadRequest(
        'Komponen biaya belum tersedia. Segera hubungi admin'
      );

    const data = await this.db.candidate.create({ data: payload });

    await this.db.bill.createMany({
      data: paymentRefs.map((pr) => ({
        userId: payload.userId,
        candidateId: data.id,
        refId: pr.id,
        fullName: user.fullName,
        email: user.email,
        title: pr.title,
        quantity: 1,
        amount: pr.amount,
      })),
    });

    await this.db.formResponse.createMany({
      data: forms.map((f) => ({
        formId: f.id,
        candidateId: data.id,
      })),
    });

    return data;
  };

  update = async (id, payload) => {
    const { photo, ...rPayload } = payload;
    const oldData = await this.db.candidate.findUniqueOrThrow({
      where: { id },
    });

    let photoPath = oldData.photoPath;
    if (photo)
      photoPath = await this.#fileManager.putFile(
        'uploads',
        'candidate-photos',
        photo
      );

    const data = await this.db.candidate.update({
      where: { id },
      data: { ...rPayload, photoPath },
    });

    if (photo && oldData.photoPath)
      await this.#fileManager.deleteFile(oldData.photoPath);

    return data;
  };

  delete = async (id) => {
    const data = await this.db.candidate.delete({ where: { id } });
    if (data.photoPath) await this.#fileManager.deleteFile(data.photoPath);
    return data;
  };
}

export default CandidateService;
