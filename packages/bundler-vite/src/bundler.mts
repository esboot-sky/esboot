import { readFile } from 'node:fs/promises';
import express from 'express';
import { createServer as createViteServer, build } from 'vite';
import { Bundler } from '@dz-web/esboot';
import { logDevServer } from '@dz-web/esboot-bundler-common';
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
    const {
      server: { port = 3000, host = '0.0.0.0' },
    } = this.cfg.config;
    const { pages } = cfg.sharedConfig;
    const vite = await createViteServer(cfg);

    app.use(vite.middlewares);

    const templateCache = new Map<string, string>();

    app.use('*', async (req, res) => {
      const { originalUrl } = req;
      const _reqUrl = originalUrl === '/' ? '/index.html' : originalUrl;

      if (_reqUrl.includes('.html')) {
        const pageNameExtracted = _reqUrl.match(/\/(.*?)\.html/);

        if (pageNameExtracted) {
          const pageName = pageNameExtracted[1];
          console.log(pages, 'pages');
          
          const pageEntryInfo = pages[pageName];

          if (pageEntryInfo) {
            const { entry, template } = pageEntryInfo;
            // const template = `${configRootPath}/${tpl}`.replace(`${cwd}`, '');

            let htmlContent = templateCache.get(template);
            if (!htmlContent) {
              htmlContent = await readFile(template, 'utf-8');
              htmlContent = htmlContent.replace(
                '</head>',
                `<script src="${entry}" type="module"></script></head>`
              );
              htmlContent = await vite.transformIndexHtml(req.url, htmlContent);
              templateCache.set(template, htmlContent || '');
            }

            res.status(200).send(htmlContent);
          } else {
            res.status(404).send('Page not found');
          }
        }
      }
    });

    app.listen(port, host, () => {
      logDevServer(port, false);
    });
  }

  async build() {
    const cfg = await getCfg(this.cfg, Environment.prod);

    await build(cfg);
  }
}

export type { BundlerViteOptions } from './types.mts';
