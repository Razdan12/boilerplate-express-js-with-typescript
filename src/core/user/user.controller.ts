import { Request, Response } from 'express';
import BaseController from '../../base/controller.base';
import { NotFound } from '../../exceptions/errors.exception';
import UserService from './user.service';

class UserController extends BaseController {
  private service = new UserService();

  findAll = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.service.findAll(req.query);
    return this.ok(res, data, 'Berhasil mendapatkan banyak User');
  });

  findById = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.service.findById(parseInt(req.params.id));
    if (!data) throw new NotFound('User tidak ditemukan');
    return this.ok(res, data, 'User ditemukan');
  });

  create = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    return this.created(res, data, 'User berhasil dibuat');
  });

  update = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.service.update(parseInt(req.params.id), req.body);
    return this.ok(res, data, 'User berhasil diperbarui');
  });

  delete = this.wrapper(async (req: Request, res: Response) => {
    await this.service.delete(parseInt(req.params.id));
    return this.noContent(res, 'User berhasil dihapus');
  });
}

export default UserController;
