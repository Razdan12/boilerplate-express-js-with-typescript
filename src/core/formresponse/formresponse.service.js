import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';
import FileManager from '../../lib/file-manager/index.js';
import {} from 'fs/promises';
import { BasicFooter, BasicHeader } from '../../lib/pdfmake/components.js';
import PDFmaker from '../../lib/pdfmake/index.js';
import {
  BadRequest,
  Forbidden,
} from '../../middlewares/exception.middleware.js';
import { FormQuestionType } from '../formquestion/formquestion.validator.js';
import { FormResponseStatus } from './formresponse.validator.js';
import { FormPageView } from '../formpage/formpage.validator.js';
import { formatTime } from '../../utils/date.js';

class FormResponseService extends BaseService {
  #fileManager;

  constructor() {
    super(prisma);
    this.#fileManager = new FileManager();
  }

  export = async (id) => {
    const data = await this.db.formResponse.findUnique({
      where: { id },
      include: {
        candidate: {
          select: {
            id: true,
            fullName: true,
            eduLevel: true,
            eduClass: true,
            studentType: true,
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
        form: {
          include: {
            pages: {
              orderBy: { order: 'asc' },
              include: {
                questions: { orderBy: { order: 'asc' } },
              },
            },
          },
        },
        answers: true,
      },
    });

    const attachments = (
      await Promise.all(
        data.form.pages
          .map((p) =>
            p.questions.filter((q) => q.type === FormQuestionType.FILE)
          )
          .flat()
          .map(async (q) => {
            const ans = data.answers.find(
              (a) => a.questionId === q.id && a.ansText
            );
            if (!ans) return null;

            const fileExist = await this.#fileManager.exist(ans.ansText);
            if (!fileExist) return null;

            const [_, ext] = ans.ansText.split('.');
            return {
              name: `${[q.label, ans.variant].filter(Boolean).join(' ')}.${ext}`,
              data: ans.ansText,
            };
          })
      )
    ).filter(Boolean);

    const pdfMaker = new PDFmaker();
    pdfMaker.setHeader(BasicHeader());
    pdfMaker.setFooter(BasicFooter());

    const renderValue = (q, anss, ans) => {
      return {
        text: [
          FormQuestionType.TEXT,
          FormQuestionType.TEXTAREA,
          FormQuestionType.SELECT,
        ].includes(q.type)
          ? (ans?.ansText ?? '')
          : [FormQuestionType.CHECK, FormQuestionType.RADIO].includes(q.type)
            ? (ans?.ansText?.split('|').join(', ') ?? '')
            : [FormQuestionType.ORDER].includes(q.type)
              ? (ans?.ansText
                  ?.split('|')
                  .map((t, i) => `${i + 1}. ${t}`)
                  .join('\n') ?? '')
              : [FormQuestionType.NUMBER].includes(q.type)
                ? (ans?.ansNumber ?? '')
                : [FormQuestionType.BOOL].includes(q.type)
                  ? ans?.ansBool
                    ? 'Ya'
                    : 'Tidak'
                  : [FormQuestionType.REGION].includes(q.type)
                    ? `Provinsi                 : ${anss.find((a) => a.subVariant == 'province')?.ansText ?? ''}
                                  Kota/Kabupaten  : ${anss.find((a) => a.subVariant == 'regency')?.ansText ?? ''}
                                  Kecamatan           : ${anss.find((a) => a.subVariant == 'district')?.ansText ?? ''}
                                  Kelurahan/Desa   : ${anss.find((a) => a.subVariant == 'village')?.ansText ?? ''}`
                    : [FormQuestionType.DATE].includes(q.type)
                      ? formatTime(ans?.ansDate, 'dddd, DD MMMM YYYY')
                      : [FormQuestionType.FILE].includes(q.type)
                        ? attachments.find((a) => a.data == ans?.ansText ?? '')
                          ? `Terlampir (${attachments.find((a) => a.data == ans?.ansText ?? '').name})`
                          : ''
                        : '',
        lineHeight: 1.25,
        marginTop: 8,
        marginBottom: 8,
      };
    };

    pdfMaker.setContent([
      {
        text: `Formulir ${data.form.title}`,
        bold: true,
        fontSize: 18,
        marginBottom: 4,
        alignment: 'center',
      },
      {
        text: `Perubahan terakhir: ${formatTime(data.updatedAt, 'DD/MM/YYYY HH:mm')}`,
        fontSize: 12,
        marginBottom: 24,
        color: '#666',
        alignment: 'center',
      },
      {
        layout: 'noBorders',
        table: {
          widths: ['20%', '2%', '78%'],
          body: [
            [
              { text: 'Responden', marginBottom: 4 },
              { text: ':' },
              { text: data.candidate.user.fullName },
            ],
            [
              { text: 'Siswa', marginBottom: 4 },
              { text: ':' },
              { text: data.candidate.fullName },
            ],
            [
              { text: 'Kelas', marginBottom: 4 },
              { text: ':' },
              {
                text: `${data.candidate.eduLevel} - ${data.candidate.eduClass}`,
              },
            ],
            [
              { text: 'Kategori', marginBottom: 4 },
              { text: ':' },
              { text: data.candidate.studentType },
            ],
          ],
        },
      },
      ...data.form.pages.map((p) => {
        if (p.view == FormPageView.LIST)
          return pdfMaker.parseContent([
            {
              text: p.title,
              fontSize: 16,
              bold: true,
              marginBottom: 16,
              marginTop: 24,
            },
            {
              layout: 'lightHorizontalLines',
              table: {
                widths: ['5%', '35%', '60%'],
                body: [
                  ['No', 'Pertanyaan', 'Jawaban'],
                  ...p.questions.map((q, i) => {
                    const anss = data.answers.filter(
                        (a) => a.questionId == q.id
                      ),
                      ans = anss.at(0);

                    return pdfMaker.parseContent([
                      { text: `${i + 1}.`, marginTop: 8, marginBottom: 8 },
                      { text: q.label, marginBottom: 8, marginTop: 8 },
                      renderValue(q, anss, ans),
                    ]);
                  }),
                ],
              },
            },
          ]);
        else if (p.view == FormPageView.TABLE)
          return pdfMaker.parseContent([
            {
              text: p.title,
              fontSize: 16,
              bold: true,
              marginBottom: 16,
              marginTop: 24,
            },
            {
              layout: 'lightHorizontalLines',
              marginTop: 8,
              marginLeft: 8,
              table: {
                widths: ['5%', '35%', '60%'],
                body: [
                  ['No', 'Pertanyaan', 'Jawaban'],
                  ...Array.from({ length: 6 })
                    .map((_, num) => {
                      return p.questions.map((q) => {
                        const anss = data.answers.filter(
                            (a) =>
                              a.questionId == q.id &&
                              a.variant == num.toString()
                          ),
                          ans = anss.at(0);

                        return pdfMaker.parseTableCell([
                          {
                            text: `${num + 1}.`,
                            marginTop: 8,
                            marginBottom: 8,
                            rowSpan: p.questions.length,
                          },
                          { text: q.label, marginBottom: 8, marginTop: 8 },
                          renderValue(q, anss, ans),
                        ]);
                      });
                    })
                    .flat(),
                ],
              },
            },
          ]);
        else if (p.view == FormPageView.VARIANTS)
          return pdfMaker.parseContent([
            {
              text: p.title,
              fontSize: 16,
              bold: true,
              marginTop: 24,
            },
            ...p.variants.split('|').map((variant) => {
              return pdfMaker.parseContent([
                {
                  text: variant,
                  fontSize: 14,
                  bold: true,
                  marginTop: 16,
                  marginLeft: 8,
                },
                {
                  layout: 'lightHorizontalLines',
                  marginTop: 8,
                  marginLeft: 8,
                  table: {
                    widths: ['5%', '35%', '60%'],
                    body: [
                      ['No', 'Pertanyaan', 'Jawaban'],
                      ...p.questions.map((q, i) => {
                        const anss = data.answers.filter(
                            (a) => a.questionId == q.id && a.variant == variant
                          ),
                          ans = anss.at(0);

                        return pdfMaker.parseContent([
                          { text: `${i + 1}.`, marginTop: 8, marginBottom: 8 },
                          { text: q.label, marginBottom: 8, marginTop: 8 },
                          renderValue(q, anss, ans),
                        ]);
                      }),
                    ],
                  },
                },
              ]);
            }),
          ]);
      }),
    ]);

    pdfMaker.generate();
    const pdf = await pdfMaker.getBuffer();

    return { data, pdf, attachments };
  };

  hasAccess = async (id, userId, ignoreSubmitted = false) => {
    const data = await this.db.formResponse.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        candidate: { select: { id: true, userId: true } },
      },
    });
    if (data.candidate.userId != userId) throw new Forbidden();
    if (!ignoreSubmitted && data.status == FormResponseStatus.SUBMITTED)
      throw new BadRequest('Respon formulir sudah disimpan permanen');
  };

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.formResponse.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.formResponse.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.formResponse.findUniqueOrThrow({
      where: { id },
      include: {
        candidate: {
          select: {
            id: true,
            fullName: true,
            eduLevel: true,
            eduClass: true,
            userId: true,
          },
        },
        form: {
          select: {
            id: true,
            title: true,
          },
        },
        answers: true,
      },
    });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.formResponse.create({ data: payload });
    return data;
  };

  update = async (id, payload, files = []) => {
    const { answers, ...restPayload } = payload;

    const oldAnswersFile = await this.db.formResponseAnswer.findMany({
      where: { responseId: id, question: { type: FormQuestionType.FILE } },
    });

    for (const file of files) {
      const [questionId, variant] = file.originalname
        .split('.')[0]
        .split('|', 2);

      const answer = answers.find(
        (a) =>
          a.questionId === questionId &&
          (variant ? a.variant === variant : !a.variant)
      );
      if (!answer) continue;

      answer.ansText = await this.#fileManager.putFile(
        'uploads',
        'formresponse-answers',
        file
      );
    }

    const data = await this.db.formResponse.update({
      where: { id },
      data: {
        ...restPayload,
        answers: {
          deleteMany: { responseId: id },
          createMany: {
            data: answers,
          },
        },
      },
    });

    await this.#fileManager.deleteFiles(
      oldAnswersFile.map((oaf) => oaf.ansText)
    );

    return data;
  };

  delete = async (id) => {
    const data = await this.db.formResponse.delete({ where: { id } });
    return data;
  };
}

export default FormResponseService;
