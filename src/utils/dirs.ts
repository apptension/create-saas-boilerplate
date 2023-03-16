import { promises as fs } from 'node:fs';
import { join } from 'node:path';

import { ensureDirSync } from 'fs-extra';

export const isEmptyDir = async (path: string) => {
  try {
    const directory = await fs.opendir(path);
    const entry = await directory.read();
    await directory.close();

    return entry === null;
  } catch {
    return false;
  }
};

export const prepareInitDirectory = async (directoryName: string) => {
  const cloneDir = join(process.cwd(), directoryName);
  ensureDirSync(cloneDir);

  const isEmpty = await isEmptyDir(cloneDir);
  if (!isEmpty) throw new Error('Init directory must be empty!');

  return cloneDir;
};
