import { Bundler } from '@dz-web/esboot';
import { logDevServer } from '@dz-web/esboot-bundler-common';
import { Environment } from '@dz-web/esboot-common/constants';
import express from 'express';
import { build, createServer as createViteServer } from 'vite';

import { getCfg } from './cfg/get-cfg';
import { isHtmlRequest } from './helpers/html-request';
import { loadHtmlContent } from './helpers/load-html-content';

const HTML_PAGE_RE = /\/(.*?)\.html/;

export class BundlerVite extends Bundler {
  name = 'vite';

  getName(): string {
    return this.name;
  }

  dev = async (): Promise<void> => {
    const app = express();
    const cfg = await getCfg(this.cfg, Environment.dev, {
      onModifyBundlerConfig: this.onModifyBundlerConfig,
    });
    const {
      server: { port = 3000, host = '0.0.0.0' },
    } = this.cfg.config;

    const { pages } = cfg.sharedConfig;
    const vite = await createViteServer(cfg);

    app.use(vite.middlewares);

    app.use('/', async (req, res) => {
      if (isHtmlRequest(req)) {
        const { originalUrl } = req;
        const _reqUrl = originalUrl.includes('.html')
          ? originalUrl
          : '/index.html';

        const pageName = _reqUrl.match(HTML_PAGE_RE)?.[1] ?? '';

        if (pages[pageName]) {
          const rawHtmlContent = await loadHtmlContent(pageName, pages);

          if (!rawHtmlContent) {
            res.status(404).send('Page not found');
            return;
          }
          const htmlContent = await vite.transformIndexHtml(
            _reqUrl,
            rawHtmlContent,
            _reqUrl,
          );

          res.status(200).send(htmlContent);
        }
        else {
          let list = '';
          for (const page of Object.keys(pages)) {
            const { title } = pages[page];
            list += `<li><a href="/${page}.html">${title}: ${page}</a></li>`;
          }
          res.status(404).send(`<div>
            <h1>Page not found, you can go to:</h1>
            <ul>${list}</ul>
            </div>`);
        }
      }
    });

    app.listen(port, host, () => {
      logDevServer(port, false);
      this.onAfterCompile();
    });
  };

  build = async (): Promise<void> => {
    const cfg = await getCfg(this.cfg, Environment.prod, {
      onModifyBundlerConfig: this.onModifyBundlerConfig,
    });

    await build(cfg);
    this.onAfterCompile();
  };
}

export type { BundlerViteOptions } from './types';
