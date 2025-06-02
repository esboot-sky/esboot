export * from 'fs-extra/esm';

// import fs from 'node:fs';
// import { writeFile, readFile } from 'node:fs/promises';

// export const pathExistsSync = (path: string) => {
//   try {
//     return fs.existsSync(path);
//   } catch (err) {
//     return false;
//   }
// };

// export const copySync = (src: string, dest: string) => {
//   try {
//     fs.cpSync(src, dest);
//   } catch (err) {
//     return false;
//   }
// };

// export const ensureFileSync = (path: string) => {
//   const exists = fs.existsSync(path);
//   if (exists) return;
//   try {
//     fs.writeFileSync(path, '');
//   } catch (err) {
//     return false;
//   }
// };

// export const ensureDirSync = (path: string) => {
//   const exists = fs.existsSync(path);
//   if (exists) return;
//   try {
//     fs.mkdirSync(path, { recursive: true });
//   } catch (err) {
//     return false;
//   }
// };

// export const writeJSON = async (path: string, data: any, ) => {
//   try {
//     await writeFile(path, JSON.stringify(data, null, 2));
//   } catch (err) {
//     return false;
//   }
// };

// export const readJSON = async (path: string) => {
//   try {
//     return JSON.parse(await readFile(path, 'utf8'));
//   } catch (err) {
//     return false;
//   }
// };
