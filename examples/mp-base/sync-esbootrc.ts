import fs from 'fs';
import path from 'path';

const bundlerMap = {
  vite: 'esbootrc/vite.ts',
  webpack: 'esbootrc/webpack.ts',
  rspack: 'esbootrc/rspack.ts',
};

const bundler = process.env.ESBOOT_BUNDLER || 'webpack';

const bundlerFile = bundlerMap[bundler];

const resContent = fs.readFileSync(bundlerFile, 'utf-8');
const esbootrcFile = path.join(__dirname, '.esbootrc.ts');

fs.writeFileSync(esbootrcFile, resContent);

console.log('sync-esbootrc success');
