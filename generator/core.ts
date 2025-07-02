// file: generate.ts
import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Untuk support __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup CLI
program
  .option('--name <name>', 'Name of the folder to create')
  .option('--model-name <modelName>', 'Model name to use for file naming');

program.parse(process.argv);
const options = program.opts();

if (!options.name || !options.modelName) {
  console.error('❌ Both --name and --model-name are required');
  process.exit(1);
}

const name: string = options.name;
const nameL: string = name.toLowerCase();
const modelName: string = options.modelName;
const basePath = path.join('./src/core', nameL);
console.log(basePath);


if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

const files = [
  {
    name: `${nameL}.validator.ts`,
    content: `import Joi from 'joi';

export const ${name}Validator = {
  create: Joi.object({
    // define schema here
  }),
  update: Joi.object({
    // define schema here
  }),
};

export default ${name}Validator;
`,
  },
  {
    name: `${nameL}.router.ts`,
    content: `import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware';
import ${name}Controller from './${nameL}.controller';
import ${name}Validator from './${nameL}.validator';
import { baseValidator } from '../../base/validator.base';
import auth from '../../middlewares/auth.middleware';

const r = Router();
const controller = new ${name}Controller();

r.get('/show-all', validatorMiddleware({ query: baseValidator.browseQuery }), controller.findAll);
r.get('/show-one/:id', controller.findById);

r.post('/create', auth(['ADMIN']), validatorMiddleware({ body: ${name}Validator.create }), controller.create);
r.put('/update/:id', auth(['ADMIN']), validatorMiddleware({ body: ${name}Validator.update }), controller.update);
r.delete('/delete/:id', auth(['ADMIN']), controller.delete);

const ${nameL}Router = r;
export default ${nameL}Router;
`,
  },
  {
    name: `${nameL}.controller.ts`,
    content: `import { Request, Response } from 'express';
import BaseController from '../../base/controller.base';
import { NotFound } from '../../exceptions/errors.exception';
import ${name}Service from './${nameL}.service';

class ${name}Controller extends BaseController {
  private service = new ${name}Service();

  findAll = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.service.findAll(req.query);
    return this.ok(res, data, 'Berhasil mendapatkan banyak ${name}');
  });

  findById = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.service.findById(parseInt(req.params.id));
    if (!data) throw new NotFound('${name} tidak ditemukan');
    return this.ok(res, data, '${name} ditemukan');
  });

  create = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    return this.created(res, data, '${name} berhasil dibuat');
  });

  update = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.service.update(parseInt(req.params.id), req.body);
    return this.ok(res, data, '${name} berhasil diperbarui');
  });

  delete = this.wrapper(async (req: Request, res: Response) => {
    await this.service.delete(parseInt(req.params.id));
    return this.noContent(res, '${name} berhasil dihapus');
  });
}

export default ${name}Controller;
`,
  },
  {
    name: `${nameL}.service.ts`,
    content: `import BaseService from '../../base/service.base';
import prisma from '../../config/prisma.db';

class ${name}Service extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query: any) => {
    const q = this.transformBrowseQuery(query);
    const data = await (this.db as any).${modelName}.findMany({ ...q });

    if (query.paginate) {
      const count = await (this.db as any).${modelName}.count({ where: q.where });
      return this.paginate(data, count, q);
    }
    return data;
  };

  findById = async (id: number) => {
    return (this.db as any).${modelName}.findUnique({ where: { id } });
  };

  create = async (payload: any) => {
    return (this.db as any).${modelName}.create({ data: payload });
  };

  update = async (id: number, payload: any) => {
    return (this.db as any).${modelName}.update({ where: { id }, data: payload });
  };

  delete = async (id: number) => {
    return (this.db as any).${modelName}.delete({ where: { id } });
  };
}

export default ${name}Service;
`,
  },
];

files.forEach((file) => {
  const fullPath = path.join(basePath, file.name);
  fs.writeFileSync(fullPath, file.content, { encoding: 'utf8' });
  console.log(`✅ Created: ${fullPath}`);
});

console.log(`🏁 Generator selesai untuk model "${modelName}" di folder "${nameL}"`);
