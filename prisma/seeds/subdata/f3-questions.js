import { FormPageView } from '../../../src/core/formpage/formpage.validator.js';
import { FormQuestionType } from '../../../src/core/formquestion/formquestion.validator.js';
import { Prisma, PrismaClient } from '../../generated/client/index.js';

/**
 * @type {(Prisma.FormPageCreateInput & {questions: Prisma.FormQuestionCreateInput[]})[]}
 */
const f3Questions = [
  {
    form: { connect: { id: '74fc4ea8-5a95-4a79-9c07-e7cbd904b1fa' } },
    order: 1,
    title: 'Hubungan',
    view: FormPageView.LIST,
    questions: [
      {
        order: 1,
        name: 'daily_closeness',
        label: 'Dalam kehidupan sehari-hari, anak lebih dekat dengan siapa?',
        type: FormQuestionType.CHECK,
        options: {
          createMany: {
            data: [
              { label: 'Ayah', value: 'Ayah' },
              { label: 'Ibu', value: 'Ibu' },
              { label: 'Kakek', value: 'Kakek' },
              { label: 'Nenek', value: 'Nenek' },
              { label: 'Kakak', value: 'Kakak' },
              { label: 'Lainnya', value: 'Lainnya', isFreeValue: true },
            ],
          },
        },
        required: true,
      },
      {
        order: 2,
        name: 'talks_with',
        label:
          'Anak membicarakan masalah/pengalaman (sehari-hari/khusus) lebih banyak dengan siapa?',
        type: FormQuestionType.CHECK,
        options: {
          createMany: {
            data: [
              { label: 'Ayah', value: 'Ayah' },
              { label: 'Ibu', value: 'Ibu' },
              { label: 'Kakek', value: 'Kakek' },
              { label: 'Nenek', value: 'Nenek' },
              { label: 'Kakak', value: 'Kakak' },
              { label: 'Lainnya', value: 'Lainnya', isFreeValue: true },
            ],
          },
        },
        required: true,
      },
      {
        order: 3,
        name: 'child_strengths',
        label: 'Kekuatan ananda',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 4,
        name: 'child_achievements',
        label: 'Prestasi yang pernah diraih ananda',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 5,
        name: 'child_weaknesses',
        label: 'Kelemahan ananda',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 6,
        name: 'parent_reported_issues',
        label: 'Masalah/keluhan anak, menurut orang tua',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 7,
        name: 'child_personality',
        label:
          'Jelaskan sifat/sikap/kebiasaan anak, ia (dalam kesehariannya) tergolong anak yang seperti apa',
        type: FormQuestionType.CHECK,
        options: {
          createMany: {
            data: [
              { label: 'Periang', value: 'Periang' },
              { label: 'Pemarah', value: 'Pemarah' },
              { label: 'Penakut', value: 'Penakut' },
              { label: 'Manja', value: 'Manja' },
              { label: 'Mudah sedih', value: 'Mudah sedih' },
              { label: 'Mudah memaafkan', value: 'Mudah memaafkan' },
              { label: 'Keras kepala', value: 'Keras kepala' },
              { label: 'Penurut', value: 'Penurut' },
              { label: 'Pendiam', value: 'Pendiam' },
              { label: 'Penyabar', value: 'Penyabar' },
              { label: 'Pemberani', value: 'Pemberani' },
              { label: 'Lainnya', value: 'Lainnya', isFreeValue: true },
            ],
          },
        },
        required: true,
      },
      {
        order: 8,
        name: 'social_behavior',
        label:
          'Bagaimanakah anak dalam pergaulan sehari-hari (dengan teman di sekolah/di lingkungan rumah/dengan saudara/di lingkungan orang dewasa)',
        type: FormQuestionType.CHECK,
        options: {
          createMany: {
            data: [
              {
                label: 'Mudah menyesuaikan diri',
                value: 'Mudah menyesuaikan diri',
              },
              {
                label: 'Sulit menyesuaikan diri',
                value: 'Sulit menyesuaikan diri',
              },
              {
                label:
                  'Mudah membina hubungan dengan teman/orang yang baru dikenalnya',
                value:
                  'Mudah membina hubungan dengan teman/orang yang baru dikenalnya',
              },
              { label: 'Bersikap pasif', value: 'Bersikap pasif' },
              { label: 'Lainnya', value: 'Lainnya', isFreeValue: true },
            ],
          },
        },
        required: true,
      },
      {
        order: 9,
        name: 'friend_preferences',
        label:
          'Menurut Anda, anak terlihat memiliki kecenderungan untuk berteman dengan teman yang seperti apa',
        type: FormQuestionType.CHECK,
        options: {
          createMany: {
            data: [
              { label: 'Sekolah', value: 'Sekolah' },
              {
                label: 'Lingkungan tempat tinggal',
                value: 'Lingkungan tempat tinggal',
              },
              { label: 'Saudara', value: 'Saudara' },
              {
                label: 'Lingkungan kegiatan/hobi',
                value: 'Lingkungan kegiatan/hobi',
              },
              { label: 'Lainnya', value: 'Lainnya', isFreeValue: true },
            ],
          },
        },
        required: true,
      },
      {
        order: 10,
        name: 'peer_role',
        label:
          'Saat bersama temannya, anak cenderung menunjukkan sikap memimpin/pengikut?',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 11,
        name: 'home_rules',
        label: 'Aturan apa saja yang orang tua terapkan di rumah?',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 12,
        name: 'rule_break_home',
        label:
          'Apakah anak Anda pernah melanggara aturan orang tua/pengasuh? dalam hal?',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 13,
        name: 'rule_break_school',
        label:
          'Apakah anak Anda pernah melanggar aturan di sekolah? dalam hal?',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 14,
        name: 'obedience_home',
        label: 'Bagaimana kepatuhan anak terhadap orang tua di rumah?',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 15,
        name: 'obedience_school',
        label: 'Bagaimana kepatuhan anak terhadap guru di sekolah?',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 16,
        name: 'responsibility',
        label:
          'Bagaimana tanggung jawab anak terhadap tugas, baik di rumah maupun di sekolah?',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 17,
        name: 'independence',
        label:
          'Bagaimana kemandirian anak ketika di rumah dan di sekolah? (misal: makan, mandi, buang air, melepas/memaikai pakaian, dll)',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 18,
        name: 'work_habits',
        label:
          'Bagaimana kebiasaan kerjanya? (misal: teliti, ulet, rapi, ceroboh, cepat menyerah menghadapi kesulitan, dll)',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 19,
        name: 'religious_practice',
        label:
          'Penerapan pendidikan agama di rumah dilakukan oleh siapa dan apa saja yang diterapkan?',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 20,
        name: 'daily_activities',
        label:
          'Apakah kegiatan anak sehari-hari selain sekolah? siapa yang mendampingi?',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
      {
        order: 21,
        name: 'family_activities',
        label:
          'Aktivitas apa saja yang Anda lakukan bersama anak ketika di rumah atau di luar rumah? (misal: main bersama, membaca buku, bersepada, dll)',
        type: FormQuestionType.TEXTAREA,
        required: true,
      },
    ],
  },
];

export default f3Questions;
