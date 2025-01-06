import express from 'express';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createServer as createViteServer, build } from 'vite';
import { Bundler } from '@dz-web/esboot';
import { Environment } from '@dz-web/esboot-common/constants';

import { getCfg } from './cfg/get-cfg.mts';

export class BundlerVite extends Bundler {
  name = 'vite';

  getName() {
    return this.name;
  }

  async dev() {
    const app = express();
    const cfg = await getCfg(this.cfg, Environment.dev);

    const vite = await createViteServer(cfg);

    // await vite.listen();
    // vite.printUrls();
    // vite.bindCLIShortcuts({ print: true });

    app.use(vite.middlewares)

    // console.log(this.cfg.config.entry.index.tpl, 'cfg');
    const { cwd, MPConfiguration, isSP, isDev } = this.cfg.config;
    let configRootPath = 'config';
    if (!isSP && MPConfiguration) {
      configRootPath = MPConfiguration.configRootPathOfPlatfrom;
    }

    const template = `${configRootPath}/${this.cfg.config.entry.index.tpl}`.replace(`${cwd}`, '')
    
    // console.log(template, 'template');
    
    app.use('*', async (req, res) => {
      if (req.url === '/' || req.url === '/index.html') {
        let htmlContent = await readFile(join(cwd, template), 'utf-8')
        // add entry script
        // console.log(this.cfg.config.entry.index.entry, 'this.cfg.config.entry.index.entry');
        
        htmlContent = htmlContent.replace('</head>', `<script src="${this.cfg.config.entry.index.entry.replace(cwd, '')}" type="module"></script></head>`)
        // console.log(htmlContent, 'htmlContent');
        
        const html = await vite.transformIndexHtml(req.url, htmlContent)
        res.send(html)
      }
      // Since `appType` is `'custom'`, should serve response here.
      // Note: if `appType` is `'spa'` or `'mpa'`, Vite includes middlewares
      // to handle HTML requests and 404s so user middlewares should be added
      // before Vite's middlewares to take effect instead
      // res.send('hello')
    })

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  }

  async build() {
    const cfg = await getCfg(this.cfg, Environment.prod);

    await build(cfg);
  }
}

export type { BundlerViteOptions } from './types.mts';
