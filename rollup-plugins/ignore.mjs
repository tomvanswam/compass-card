import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let NO_ELEMENTS = 0;
const candidates = [
  path.resolve(__dirname, '../dist/src/const.js'),
  path.resolve(__dirname, '../src/const.js'),
  path.resolve(__dirname, '../src/const.mjs'),
];

for (const p of candidates) {
  if (!fs.existsSync(p)) continue;
  try {
    const mod = await import(pathToFileURL(p).href);
    const { NO_ELEMENTS: importedNO_ELEMENTS } = mod;
    if (typeof importedNO_ELEMENTS === 'number') {
      NO_ELEMENTS = importedNO_ELEMENTS;
    }
    break;
  } catch {
    // ignore and try next candidate
  }
}

export default function (userOptions = {}) {
  const files = userOptions.files || [];

  if (files.length === NO_ELEMENTS) {
    return { name: 'ignore' };
  }

  return {
    load(id) {
      return files.some((toIgnorePath) => id.startsWith(toIgnorePath))
        ? { code: '' }
        : null;
    },
    name: 'ignore',
  };
}
