import { FormQuestionType } from '../../../src/core/formquestion/formquestion.validator.js';
import { Prisma, PrismaClient } from '../../generated/client/index.js';

/**
 * @type {Prisma.FormCreateManyInput[]}
 */
const formList = [
  {
    id: 'b6c9d072-03fa-4812-82bd-48e6e6046581',
    title: 'F1 - Pendaftaran',
  },
  {
    id: '90d216e0-5680-4ce0-a7cd-c17152d775e7',
    title: 'F2 - Formulir Kesehatan',
  },
  {
    id: '74fc4ea8-5a95-4a79-9c07-e7cbd904b1fa',
    title: 'F3 - Hubungan Keluarga',
  },
  {
    id: 'bf399703-db51-4839-9660-e91a2a1ed366',
    title: 'F4 - Tentang SADe',
  },
];

/**
 * @param {PrismaClient} prisma
 */
async function seedForm(prisma) {
  try {
    const result = await prisma.form.createMany({
      data: formList,
      skipDuplicates: true,
    });

    console.log(
      `✅ Form seeder ${formList.length} data ${result.count} inserted`
    );
  } catch (error) {
    console.error('❌', error);
  }
}

export default seedForm;
