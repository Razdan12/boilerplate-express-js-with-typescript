const imageFileTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg'];

const validateImageFileType = (file: Express.Multer.File | undefined): boolean => {
  if (!file) return false;
  return imageFileTypes.includes(file.mimetype);
};

export { validateImageFileType };
