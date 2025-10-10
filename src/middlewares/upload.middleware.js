import multer from 'multer';

/**
 * @param {{
 *  mimeTypes: (
 *    'application/pdf' |
 *    'application/msword' |
 *    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' |
 *    'image/jpeg' |
 *    'image/jpg' |
 *    'image/png' |
 *    'video/mp4' |
 *    'video/webm'
 *  )[];
 *  maxBytes: number;
 * }} options
 * @returns {multer.Multer}
 */
const upload = ({
  mimeTypes = [
    'application/msword',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'video/mp4',
    'video/webm',
  ],
  maxBytes,
}) => {
  const storage = multer.memoryStorage();

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (mimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const allowedExtensions = mimeTypes
          .map((mim) => mim.split('/')[1])
          .join(', ');
        cb(
          new Error(
            `Hanya fail ekstensi ${allowedExtensions} yang diperbolehkan.`
          ),
          false
        );
      }
    },
    limits: { fileSize: maxBytes },
  });
};

export { upload };
