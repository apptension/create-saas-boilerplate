import { promises as fs } from 'node:fs';
import { join } from 'node:path';

import { ensureDirSync, pathExistsSync, removeSync } from 'fs-extra';

export const isEmptyDir = async (path: string): Promise<boolean> => {
  try {
    const directory = await fs.opendir(path);
    const entry = await directory.read();
    await directory.close();

    return entry === null;
  } catch {
    return false;
  }
};

export const prepareInitDirectory = async (directoryName: string): Promise<string> => {
  const cloneDir = join(process.cwd(), directoryName);
  ensureDirSync(cloneDir);

  const isEmpty = await isEmptyDir(cloneDir);
  if (!isEmpty) throw new Error('Init directory must be empty!');

  return cloneDir;
};

export const removeGit = async (directoryName: string): Promise<void> => {
  const gitDir = join(directoryName, '.git');

  if (pathExistsSync(gitDir)) {
    removeSync(gitDir);
  }
};

export const readEnvFile = async (envFilePath: string, required = false): Promise<Buffer | null> => {
  try {
    await fs.lstat(envFilePath);
  } catch {
    if (required) {
      console.error(`${envFilePath} file does not exists. Searched path: ${envFilePath}`);
      console.error("This error is most likely a user's misconfiguration (someone deleted or renamed the file)");
    }

    return null;
  }

  return fs.readFile(envFilePath);
};
