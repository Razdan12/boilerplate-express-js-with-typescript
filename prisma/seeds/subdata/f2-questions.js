import { FormPageView } from '../../../src/core/formpage/formpage.validator.js';
import { FormQuestionType } from '../../../src/core/formquestion/formquestion.validator.js';
import { Prisma, PrismaClient } from '../../generated/client/index.js';

/**
 * @type {(Prisma.FormPageCreateInput & {questions: Prisma.FormQuestionCreateInput[]})[]}
 */
const f2Questions = [
  {
    form: { connect: { id: '90d216e0-5680-4ce0-a7cd-c17152d775e7' } },
    order: 1,
    title: 'Data diri',
    view: FormPageView.LIST,
    questions: [
      {
        order: 1,
        name: 'weight',
        label: 'Berat badan (Kg)',
        type: FormQuestionType.NUMBER,
        required: true,
      },
      {
        order: 2,
        name: 'height',
        label: 'Tinggi badan (Cm)',
        type: FormQuestionType.NUMBER,
        required: true,
      },
      {
        order: 3,
        name: 'blood_type',
        label: 'Golongan darah',
        type: FormQuestionType.RADIO,
        required: true,
        options: {
          createMany: {
            data: [
              { label: 'A', value: 'A' },
              { label: 'B', value: 'B' },
              { label: 'AB', value: 'AB' },
              { label: 'O', value: 'O' },
            ],
          },
        },
      },
      {
        order: 4,
        name: 'insurance_number',
        label: 'Nomor asuransi',
        type: FormQuestionType.TEXT,
        required: true,
      },
    ],
  },
  {
    form: { connect: { id: '90d216e0-5680-4ce0-a7cd-c17152d775e7' } },
    order: 2,
    title: 'Keadaan darurat',
    view: FormPageView.VARIANTS,
    variants: 'Orang terdekat|Rumah sakit|Dokter',
    variantsRequired: 'false|false|false',
    questions: [
      {
        order: 1,
        name: 'emergency_name',
        label: 'Nama',
        type: FormQuestionType.TEXT,
        required: false,
      },
      {
        order: 2,
        name: 'emergency_phone',
        label: 'No telepon',
        type: FormQuestionType.TEXT,
        required: false,
      },
    ],
  },
  {
    form: { connect: { id: '90d216e0-5680-4ce0-a7cd-c17152d775e7' } },
    order: 3,
    title: 'Riwayat kesehatan',
    view: FormPageView.LIST,
    questions: [
      {
        id: '8efe4d14-d02c-4409-8a01-b2ea52824267',
        order: 1,
        name: 'surgery_experience',
        label: 'Pernahkah anak Anda dioperasi?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        parent: { connect: { id: '8efe4d14-d02c-4409-8a01-b2ea52824267' } },
        order: 2,
        name: 'surgery_type',
        label: 'Jenis operasi',
        type: FormQuestionType.TEXTAREA,
      },
      {
        parent: { connect: { id: '8efe4d14-d02c-4409-8a01-b2ea52824267' } },
        order: 3,
        name: 'surgery_when',
        label: 'Kapan',
        type: FormQuestionType.TEXT,
      },

      {
        id: 'fc40ff47-d43c-4ab2-a8ac-f99b645fcb06',
        order: 4,
        name: 'serious_illness',
        label:
          'Pernahkah anak Anda mengalami penyakit berat yang mengharuskan ia dirawat di rumah sakit?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        parent: { connect: { id: 'fc40ff47-d43c-4ab2-a8ac-f99b645fcb06' } },
        order: 5,
        name: 'illness_reason',
        label: 'Alasan dirawat',
        type: FormQuestionType.TEXTAREA,
      },
      {
        parent: { connect: { id: 'fc40ff47-d43c-4ab2-a8ac-f99b645fcb06' } },
        order: 6,
        name: 'illness_when',
        label: 'Kapan',
        type: FormQuestionType.TEXT,
      },
      {
        parent: { connect: { id: 'fc40ff47-d43c-4ab2-a8ac-f99b645fcb06' } },
        order: 7,
        name: 'illness_duration',
        label: 'Jangka waktu perawatan',
        type: FormQuestionType.TEXT,
      },
      {
        id: '322d6266-a0b7-4f12-8cec-20b0d0264400',
        order: 8,
        name: 'food_allergy',
        label: 'Apakah anak Anda mempunyai alergi terhadap makanan?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        parent: { connect: { id: '322d6266-a0b7-4f12-8cec-20b0d0264400' } },
        order: 9,
        name: 'food_allergy_desc',
        label: 'Jelaskan',
        type: FormQuestionType.TEXTAREA,
      },

      {
        id: '26f73268-10e7-4902-9adf-86957d947a1f',
        order: 10,
        name: 'other_allergy',
        label: 'Apakah anak Anda mempunyai alergi tertentu selain makanan?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        parent: { connect: { id: '26f73268-10e7-4902-9adf-86957d947a1f' } },
        order: 11,
        name: 'other_allergy_desc',
        label: 'Jelaskan',
        type: FormQuestionType.TEXTAREA,
      },

      {
        id: 'eeb9b8a3-ec37-4a28-a8f4-410a05c525e6',
        order: 12,
        name: 'ongoing_treatment',
        label: 'Apakah anak Anda sedang dalam masa pengobatan',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        parent: { connect: { id: 'eeb9b8a3-ec37-4a28-a8f4-410a05c525e6' } },
        order: 13,
        name: 'treatment_desc',
        label: 'Jelaskan',
        type: FormQuestionType.TEXTAREA,
      },

      {
        id: '61f0bad0-564c-4222-a335-c9f5f5f9b2f9',
        order: 14,
        name: 'psychological_exam',
        label: 'Apakah anda Anda pernah mengikuti pemeriksaan psikologis',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        parent: { connect: { id: '61f0bad0-564c-4222-a335-c9f5f5f9b2f9' } },
        order: 15,
        name: 'exam_when',
        label: 'Kapan',
        type: FormQuestionType.TEXT,
      },
      {
        parent: { connect: { id: '61f0bad0-564c-4222-a335-c9f5f5f9b2f9' } },
        order: 16,
        name: 'exam_where',
        label: 'Dimana',
        type: FormQuestionType.TEXT,
      },
      {
        parent: { connect: { id: '61f0bad0-564c-4222-a335-c9f5f5f9b2f9' } },
        order: 17,
        name: 'exam_purpose',
        label: 'Untuk keperluan apa',
        type: FormQuestionType.TEXTAREA,
      },
      {
        parent: { connect: { id: '61f0bad0-564c-4222-a335-c9f5f5f9b2f9' } },
        order: 18,
        name: 'exam_result_file',
        label: 'Hasilnya',
        type: FormQuestionType.FILE,
      },

      {
        id: 'c67e90ca-1cbd-46cd-a53d-3f074e5a10e6',
        order: 19,
        name: 'development_disorder',
        label: 'Apakah anak Anda mempunyai gangguan perkembangan?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        parent: { connect: { id: 'c67e90ca-1cbd-46cd-a53d-3f074e5a10e6' } },
        order: 20,
        name: 'disorder_type',
        label: 'Apa saja?',
        type: FormQuestionType.CHECK,
        options: {
          createMany: {
            data: [
              { label: 'ADD', value: 'ADD' },
              { label: 'ADHD', value: 'ADHD' },
              { label: 'Speech Delay', value: 'Speech Delay' },
              { label: 'Autism', value: 'Autism' },
              {
                label: 'Lainnya, jelaskan',
                value: 'Lainnya',
                isFreeValue: true,
              },
            ],
          },
        },
      },

      {
        id: '2a280c71-832d-4ad9-a1bb-35413dcd91d4',
        order: 21,
        name: 'therapy_experience',
        label:
          'Apakah anak Anda sudah pernah atau sedang menjalani proses terapi?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        parent: { connect: { id: '2a280c71-832d-4ad9-a1bb-35413dcd91d4' } },
        order: 22,
        name: 'therapy_type',
        label: 'Jenis terapi',
        type: FormQuestionType.TEXT,
      },
      {
        parent: { connect: { id: '2a280c71-832d-4ad9-a1bb-35413dcd91d4' } },
        order: 23,
        name: 'therapy_where',
        label: 'Dimana',
        type: FormQuestionType.TEXT,
      },
      {
        parent: { connect: { id: '2a280c71-832d-4ad9-a1bb-35413dcd91d4' } },
        order: 24,
        name: 'therapy_duration',
        label: 'Berjalan berapa lama',
        type: FormQuestionType.TEXT,
      },

      {
        order: 25,
        name: 'vision_ability',
        label: 'Kemampuan penglihatan',
        type: FormQuestionType.RADIO,
        required: true,
        options: {
          createMany: {
            data: [
              { label: 'Baik', value: 'Baik' },
              { label: 'Sedang', value: 'Sedang' },
              { label: 'Buruk', value: 'Buruk' },
            ],
          },
        },
      },
      {
        order: 26,
        name: 'vision_problem',
        label: 'Kemampuan penglihatan',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        order: 27,
        name: 'hearing_ability',
        label: 'Kemampuan pendengaran',
        type: FormQuestionType.RADIO,
        required: true,
        options: {
          createMany: {
            data: [
              { label: 'Baik', value: 'Baik' },
              { label: 'Sedang', value: 'Sedang' },
              { label: 'Buruk', value: 'Buruk' },
            ],
          },
        },
      },
      {
        order: 28,
        name: 'hearing_aid',
        label: 'Menggunakan alat bantu dengar',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        order: 29,
        name: 'mobility_ability',
        label: 'Kemampuan bergerak',
        type: FormQuestionType.RADIO,
        required: true,
        options: {
          createMany: {
            data: [
              { label: 'Baik', value: 'Baik' },
              { label: 'Sedang', value: 'Sedang' },
              { label: 'Buruk', value: 'Buruk' },
            ],
          },
        },
      },
      {
        order: 30,
        name: 'mobility_aid',
        label: 'Menggunakan alat bantu gerak',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        order: 31,
        name: 'handedness',
        label: 'Kebiasaan menggunakan alat gerak',
        type: FormQuestionType.RADIO,
        required: true,
        options: {
          createMany: {
            data: [
              { value: 'Kanan', label: 'Kanan' },
              { value: 'Kiri', label: 'Kiri' },
              { value: 'Keduanya', label: 'Keduanya' },
              {
                value: 'Lainnya',
                label: 'Bukan keduanya, jelaskan',
                isFreeValue: true,
              },
            ],
          },
        },
      },
    ],
  },
];

export default f2Questions;
