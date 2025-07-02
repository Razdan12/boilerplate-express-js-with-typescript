import fs from "fs";

export function removeFile(filepath: string): boolean {
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  return true;
}
