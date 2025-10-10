import {
  CandidateEduLevel,
  CandidateStudentType,
} from '../../../src/core/candidate/candidate.validator.js';
import { PaymentRefType } from '../../../src/core/paymentref/paymentref.validator.js';
import { Prisma, PrismaClient } from '../../generated/client/index.js';

/**
 * @type {Prisma.PaymentRefCreateManyInput[]}
 */
const paymentRefList = [
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'SPP Per Bulan	Siswa',
    eduLevel: CandidateEduLevel.TK,
    studentType: CandidateStudentType.REGULAR,
    amount: 1200000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'DPP',
    eduLevel: CandidateEduLevel.TK,
    studentType: '',
    amount: 7000000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Biaya Jihad Harta Pertahun Siswa',
    eduLevel: CandidateEduLevel.TK,
    studentType: CandidateStudentType.REGULAR,
    amount: 5500000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'SPP Per Bulan',
    eduLevel: CandidateEduLevel.TK,
    studentType: CandidateStudentType.ABKWC,
    amount: 3900000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'SPP Per Bulan',
    eduLevel: CandidateEduLevel.TK,
    studentType: CandidateStudentType.ABKWOC,
    amount: 2700000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Seragam',
    eduLevel: CandidateEduLevel.TK,
    studentType: '',
    amount: 300000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Asuransi',
    eduLevel: CandidateEduLevel.TK,
    studentType: '',
    amount: 50000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Orientasi Orang Tua',
    eduLevel: CandidateEduLevel.TK,
    studentType: '',
    amount: 500000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'DPP',
    eduLevel: CandidateEduLevel.SD,
    studentType: '',
    amount: 15000000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Biaya Jihad per Tahun	Siswa',
    eduLevel: CandidateEduLevel.SD,
    studentType: CandidateStudentType.REGULAR,
    amount: 5500000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'SPP Per Bulan	Siswa',
    eduLevel: CandidateEduLevel.SD,
    studentType: CandidateStudentType.REGULAR,
    amount: 1540000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'SPP Per Bulan',
    eduLevel: CandidateEduLevel.SD,
    studentType: CandidateStudentType.ABKWC,
    amount: 3900000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'SPP Per Bulan',
    eduLevel: CandidateEduLevel.SD,
    studentType: CandidateStudentType.ABKWOC,
    amount: 2700000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Seragam',
    eduLevel: CandidateEduLevel.SD,
    studentType: '',
    amount: 750000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Asuransi',
    eduLevel: CandidateEduLevel.SD,
    studentType: '',
    amount: 50000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Orientasi Orang Tua',
    eduLevel: CandidateEduLevel.SD,
    studentType: '',
    amount: 500000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'DPP',
    eduLevel: CandidateEduLevel.SM,
    studentType: '',
    amount: 8000000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Biaya Jihad Harta Pertahun	Siswa',
    eduLevel: CandidateEduLevel.SM,
    studentType: CandidateStudentType.REGULAR,
    amount: 5500000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'SPP Per Bulan	Siswa',
    eduLevel: CandidateEduLevel.SM,
    studentType: CandidateStudentType.REGULAR,
    amount: 1570000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'SPP Per Bulan',
    eduLevel: CandidateEduLevel.SM,
    studentType: CandidateStudentType.ABKWC,
    amount: 4200000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'SPP Per Bulan',
    eduLevel: CandidateEduLevel.SM,
    studentType: CandidateStudentType.ABKWOC,
    amount: 2850000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Seragam',
    eduLevel: CandidateEduLevel.SM,
    studentType: '',
    amount: 750000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Asuransi',
    eduLevel: CandidateEduLevel.SM,
    studentType: '',
    amount: 50000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Orientasi Orang Tua',
    eduLevel: CandidateEduLevel.SM,
    studentType: '',
    amount: 500000,
  },
  {
    type: PaymentRefType.INITIAL_PAYMENT,
    title: 'Pendaftaran',
    eduLevel: '',
    studentType: '',
    amount: 750000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Jihad Harta',
    eduLevel: CandidateEduLevel.TK,
    studentType: CandidateStudentType.ABKWC,
    amount: 6000000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Jihad Harta',
    eduLevel: CandidateEduLevel.SD,
    studentType: CandidateStudentType.ABKWOC,
    amount: 6000000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Jihad Harta',
    eduLevel: CandidateEduLevel.SM,
    studentType: CandidateStudentType.ABKWOC,
    amount: 6000000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Jihad Harta',
    eduLevel: CandidateEduLevel.TK,
    studentType: CandidateStudentType.ABKWOC,
    amount: 6000000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Jihad Harta',
    eduLevel: CandidateEduLevel.SD,
    studentType: CandidateStudentType.ABKWC,
    amount: 6000000,
  },
  {
    type: PaymentRefType.FULL_PAYMENT,
    title: 'Jihad Harta',
    eduLevel: CandidateEduLevel.SM,
    studentType: CandidateStudentType.ABKWC,
    amount: 6000000,
  },
];

/**
 * @param {PrismaClient} prisma
 */
async function seedPaymentRef(prisma) {
  try {
    const result = await prisma.paymentRef.createMany({
      data: paymentRefList,
      skipDuplicates: true,
    });

    console.log(
      `✅ PaymentRef seeder ${paymentRefList.length} data ${result.count} inserted`
    );
  } catch (error) {
    console.error('❌', error);
  }
}

export default seedPaymentRef;
