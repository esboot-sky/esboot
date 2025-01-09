import express from 'express';
import { createServer as createViteServer, build } from 'vite';
import { Bundler } from '@dz-web/esboot';
import { logDevServer } from '@dz-web/esboot-bundler-common';
import { Environment } from '@dz-web/esboot-common/constants';

import { loadHtmlContent } from './helpers/load-html-content.mts';
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

    app.use('*', async (req, res) => {
      const isHtmlRequest = req.headers.accept?.includes('text/html');

      if (isHtmlRequest) {
        const { originalUrl } = req;
        const _reqUrl = originalUrl.includes('.html')
          ? originalUrl
          : '/index.html';

        const pageNameExtracted = _reqUrl.match(/\/(.*?)\.html/);

        if (pageNameExtracted) {
          const pageName = pageNameExtracted[1];
          const rawHtmlContent = loadHtmlContent(pageName, pages);

          if (!rawHtmlContent) {
            res.status(404).send('Page not found');
            return;
          }
          const htmlContent = await vite.transformIndexHtml(
            _reqUrl,
            rawHtmlContent,
            _reqUrl
          );

          res.status(200).send(htmlContent);
        } else {
          res.status(404).send('Page not found');
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
