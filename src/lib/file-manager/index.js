import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import JSZip from 'jszip';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const copyFile = promisify(fs.copyFile);
const access = promisify(fs.access);

class FileManager {
  constructor() {}

  makeDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  generateFilename(originalname) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${uniqueSuffix}-${originalname}`;
  }

  /**
   * @param {'uploads' | 'public'} dir
   * @param {string} bucket
   * @param {Express.Multer.File} file
   */
  async putFile(dir, bucket, file) {
    this.makeDir(`${dir}/${bucket}`);
    const filename = this.generateFilename(file.originalname);
    const filepath = path.join(dir, bucket, filename);
    await writeFile(filepath, file.buffer);
    return filepath;
  }

  /**
   * @param {'uploads' | 'public'} dir
   * @param {string} bucket
   * @param {Express.Multer.File[]} files
   */
  async putFiles(dir, bucket, files) {
    this.makeDir(`${dir}/${bucket}`);

    const promises = files.map((file) => this.putFile(dir, bucket, file));
    const filepaths = await Promise.all(promises);

    return filepaths;
  }

  /**
   * @param {string} filepath
   */
  async deleteFile(filepath) {
    if (fs.existsSync(filepath)) {
      await unlink(filepath);
    }
  }

  /**
   * @param {string[]} filepaths
   */
  async deleteFiles(filepaths) {
    const deletions = filepaths.map((filepath) => this.deleteFile(filepath));
    await Promise.all(deletions);
  }

  /**
   * @param {string} filepath full path to source file
   * @param {'uploads' | 'public'} dir destination base dir
   * @param {string} bucket destination bucket
   */
  async copyFile(filepath, dir, bucket) {
    try {
      await access(filepath, fs.constants.F_OK);
    } catch {
      return null;
    }
    this.makeDir(`${dir}/${bucket}`);
    const filename = path.basename(filepath);
    const destFilepath = path.join(dir, bucket, filename);
    await copyFile(filepath, destFilepath);
    return destFilepath;
  }

  /**
   * @param {string} filepath full path to source file
   */
  async exist(filepath) {
    try {
      await access(filepath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * @param {Buffer|null} existingZipBuffer
   * @param {Array<{name: string, data: Buffer|string, fromDisk?: boolean}>} files
   * @returns {Promise<Buffer>}
   */
  async zipFiles(existingZipBuffer, files) {
    const zip = existingZipBuffer
      ? await JSZip.loadAsync(existingZipBuffer)
      : new JSZip();

    for (const file of files) {
      let fileData = file.data;

      if (file.fromDisk) {
        fileData = await readFile(file.data);
      }

      zip.file(file.name, fileData);
    }

    return await zip.generateAsync({ type: 'nodebuffer' });
  }
}

export default FileManager;
