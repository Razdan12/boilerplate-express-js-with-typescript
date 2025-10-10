import { PrismaClient } from '../generated/client/index.js';
import seedPaymentRef from './data/paymentref.js';
import seedFormQuestion from './data/formquestion.js';
import seedForm from './data/form.js';
import seedUserRole from './data/userrole.js';
import seedUser from './data/user.js';
import seedRole from './data/role.js';

const prisma = new PrismaClient();

await seedRole(prisma);
await seedUser(prisma);
await seedUserRole(prisma);
await seedForm(prisma);
await seedFormQuestion(prisma);
await seedPaymentRef(prisma);
