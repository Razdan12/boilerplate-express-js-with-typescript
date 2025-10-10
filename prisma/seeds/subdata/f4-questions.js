import { FormPageView } from '../../../src/core/formpage/formpage.validator.js';
import { FormQuestionType } from '../../../src/core/formquestion/formquestion.validator.js';
import { Prisma } from '../../generated/client/index.js';

/**
 * @type {(Prisma.FormPageCreateInput & {questions: Prisma.FormQuestionCreateInput[]})[]}
 */
const f4Questions = [
  {
    form: { connect: { id: 'bf399703-db51-4839-9660-e91a2a1ed366' } },
    order: 1,
    title: 'Alasan memilih SADe',
    view: FormPageView.LIST,
    questions: [
      {
        order: 1,
        name: 'reason_choose_sade',
        label: 'Alasan memilih SADE?',
        type: FormQuestionType.CHECK,
        options: {
          createMany: {
            data: [
              { label: 'Lokasi', value: 'Lokasi' },
              { label: 'Kualitas staf', value: 'Kualitas staf' },
              { label: 'Perilaku siswa', value: 'Perilaku siswa' },
              { label: 'Suasana', value: 'Suasana' },
              { label: 'Kurikulum', value: 'Kurikulum' },
              { label: 'Penjelasan marketing', value: 'Penjelasan marketing' },
              { label: 'Reputasi', value: 'Reputasi' },
              { label: 'Kualitas mengajar', value: 'Kualitas mengajar' },
              { label: 'Kelas & displaynya', value: 'Kelas & displaynya' },
              { label: 'Brosur', value: 'Brosur' },
              {
                label: 'Rekomendasi orangtua lain',
                value: 'Rekomendasi orangtua lain',
              },
              { label: 'Lainnya', value: 'Lainnya', isFreeValue: true },
            ],
          },
        },
        required: true,
      },
      {
        order: 2,
        name: 'known_programs',
        label: 'Program di SADE apa saja yang sudah Anda ketahui?',
        type: FormQuestionType.CHECK,
        options: {
          createMany: {
            data: [
              { label: 'Tahsin-tahfidz', value: 'Tahsin-tahfidz' },
              {
                label: 'Camping di kaki gunung',
                value: 'Camping di kaki gunung',
              },
              { label: 'Sholat berjamaah', value: 'Sholat berjamaah' },
              {
                label: 'Fieldtrip & bermalam di luar kota',
                value: 'Fieldtrip & bermalam di luar kota',
              },
              { label: 'Outbound', value: 'Outbound' },
              { label: 'Guru tamu', value: 'Guru tamu' },
              { label: 'Ekstrakurikuler', value: 'Ekstrakurikuler' },
              { label: 'Outing sesuai tema', value: 'Outing sesuai tema' },
              { label: 'Market day', value: 'Market day' },
              {
                label: 'Ramadhan public service',
                value: 'Ramadhan public service',
              },
              { label: 'Catering', value: 'Catering' },
              {
                label: 'Media dari barang bekas pakai',
                value: 'Media dari barang bekas pakai',
              },
              { label: 'Bank Sampah', value: 'Bank Sampah' },
              { label: 'Presiden siswa', value: 'Presiden siswa' },
              { label: 'Rolling book', value: 'Rolling book' },
              { label: 'Project bersama ortu', value: 'Project bersama ortu' },
              { label: 'Lainnya', value: 'Lainnya', isFreeValue: true },
            ],
          },
        },
        required: true,
      },
      {
        order: 3,
        name: 'accept_balanced_education',
        label:
          'Apakah anda bersedia menerima konsep sekolah yang memfasilitasi perkembangan jasmani, kemampuan berpikir, dan sosial-emosi secara seimbang?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        order: 4,
        name: 'accept_food_variety',
        label:
          'Apakah Anda setuju dengan pembiasaan pemberian variasi makanan sejak kecil?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        order: 5,
        name: 'accept_non_academic_priority',
        label:
          'Apakah Anda bersedia untuk tidak menjadikan nilai angka dan ranking sebagai prioritas tujuan belajar?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        order: 6,
        name: 'education_goal',
        label: 'Apakah tujuan pendidikan bagi anak Anda',
        type: FormQuestionType.TEXT,
        required: true,
      },
      {
        order: 7,
        name: 'education_priority_factors',
        label: 'Urutkan prioritas faktor penting dalam pendidikan menurut Anda',
        type: FormQuestionType.ORDER,
        options: {
          createMany: {
            data: [
              { label: 'Sarana', value: 'Sarana' },
              { label: 'Kualitas guru', value: 'Kualitas guru' },
              {
                label: 'Resources (buku, pelatihan)',
                value: 'Resources (buku, pelatihan)',
              },
              { label: 'Metode belajar', value: 'Metode belajar' },
            ],
          },
        },
        required: true,
      },
      {
        order: 8,
        name: 'desired_skills',
        label:
          'Urutkan prioritas Anda menganai keterampilan apa yang ingin dimiliki oleh ananda',
        type: FormQuestionType.ORDER,
        options: {
          createMany: {
            data: [
              { label: 'Menolong orang lain', value: 'Menolong orang lain' },
              { label: 'Menguasai olahraga', value: 'Menguasai olahraga' },
              {
                label: 'Membaca dan menghafal Quran',
                value: 'Membaca dan menghafal Quran',
              },
              { label: 'Mencari pengetahuan', value: 'Mencari pengetahuan' },
              {
                label: 'Terampil berkomunikasi',
                value: 'Terampil berkomunikasi',
              },
              {
                label: 'Memimpin dirinya & orang lain',
                value: 'Memimpin dirinya & orang lain',
              },
              { label: 'Menguasai komputer', value: 'Menguasai komputer' },
              { label: 'Memecahkan masalah', value: 'Memecahkan masalah' },
            ],
          },
        },
        required: true,
      },
      {
        order: 9,
        name: 'accept_spp_increase',
        label:
          'Apakah Anda bersedia mengikuti ketentuan kenaikan Bea Guru (SPP) per tahun sebesar inflasi nasional di tahun berjalan?',
        type: FormQuestionType.BOOL,
        required: true,
      },
      {
        order: 10,
        name: 'accept_higher_costs',
        label:
          'Apakah Anda bersedia menerima konsekuensi biaya KBM (Kegiatan Belajar Mengajar) yang semakin besar di level kelas yang lebih tinggi terkait target pembelajaran yang semakin kompleks?',
        type: FormQuestionType.BOOL,
        required: true,
      },
    ],
  },
  {
    form: { connect: { id: 'bf399703-db51-4839-9660-e91a2a1ed366' } },
    order: 2,
    title: 'Rencana keterlibatan',
    view: FormPageView.VARIANTS,
    variants: 'Ayah|Ibu',
    variantsRequired: 'false|false',
    questions: [
      {
        order: 1,
        name: 'shareable_skills',
        label:
          'Kemampuan yang dikuasai dan dapat dibagikan pada komunitas SADE',
        type: FormQuestionType.TEXTAREA,
      },
      {
        order: 2,
        name: 'preferred_roles',
        label: 'Peran yang dipilih',
        type: FormQuestionType.CHECK,
        options: {
          createMany: {
            data: [
              { label: 'Fundrising', value: 'Fundrising' },
              { label: 'Kepanitiaan event', value: 'Kepanitiaan event' },
              { label: 'Pengurus komite', value: 'Pengurus komite' },
              { label: 'Marketing', value: 'Marketing' },
              {
                label: 'Volunteer di posisi tertentu bidang',
                value: 'Volunteer di posisi tertentu bidang',
                isFreeValue: true,
              },
              {
                label: 'Guru tamu/narasumber bidang',
                value: 'Guru tamu/narasumber bidang',
                isFreeValue: true,
              },
            ],
          },
        },
      },
      {
        order: 3,
        name: 'fundraising_institutions',
        label: 'Lembaga yang dapat diakses untuk keperluan penggalangan dana',
        type: FormQuestionType.TEXTAREA,
      },
    ],
  },
];

export default f4Questions;
