import { Prisma, PrismaClient } from '../../generated/client/index.js';
import f1Questions from '../subdata/f1-questions.js';
import f2Questions from '../subdata/f2-questions.js';
import f3Questions from '../subdata/f3-questions.js';
import f4Questions from '../subdata/f4-questions.js';

const formQuestionList = [
  ...f1Questions,
  ...f2Questions,
  ...f3Questions,
  ...f4Questions,
];

/**
 * @param {PrismaClient} prisma
 */
async function seedFormQuestion(prisma) {
  let success = 0;

  for (const item of formQuestionList) {
    try {
      const { questions, ...formPageItem } = item;

      let formPage = await prisma.formPage.findFirst({
        where: {
          formId: formPageItem.form.connect.id,
          title: formPageItem.title,
        },
      });
      if (!formPage)
        formPage = await prisma.formPage.create({
          data: formPageItem,
        });

      for (const questionItem of questions) {
        try {
          await prisma.formQuestion.create({
            data: {
              ...questionItem,
              page: { connect: { id: formPage.id } },
            },
          });
          success++;
        } catch {
          // silent
        }
      }
    } catch {
      // silent
    }
  }

  console.log(
    `✅ FormQuestion seeder ${formQuestionList.reduce((a, c) => (a += c.questions.length), 0)} data ${success} inserted`
  );
}

export default seedFormQuestion;
