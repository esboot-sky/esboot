import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Bundler } from '@dz-web/esboot';
import { logDevServer } from '@dz-web/esboot-bundler-common';
import { Environment } from '@dz-web/esboot-common/constants';
import express from 'express';
import { build, createServer as createViteServer } from 'vite';

import { getCfg } from './cfg/get-cfg';
import { isHtmlRequest, normalizePublicPath, stripPublicPath } from './helpers/html-request';
import { loadHtmlContent } from './helpers/load-html-content';
import {
  hasSsgEnabledPages,
  prerenderSsgPages,
  renderSsgHtmlForPage,
} from './helpers/ssg';

const HTML_PAGE_RE = /\/(.*?)\.html/;
const URL_SUFFIX_RE = /[?#]/;

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
      ipv4,
      publicPath,
      server: { port = 3000, host = '0.0.0.0' },
    } = this.cfg.config;

    const { pages } = cfg.sharedConfig;
    const vite = await createViteServer(cfg);
    const pageBasePath = normalizePublicPath(publicPath);

    app.use('/', async (req, res, next) => {
      if (!isHtmlRequest(req, publicPath)) {
        next();
        return;
      }

      const pathname = stripPublicPath(req.originalUrl.split(URL_SUFFIX_RE, 1)[0], publicPath);
      const reqUrl = pathname.includes('.html')
        ? pathname
        : '/index.html';

      const pageName = reqUrl.match(HTML_PAGE_RE)?.[1] ?? '';

      if (pages[pageName]) {
        const rawHtmlContent = await loadHtmlContent(pageName, pages);

        if (!rawHtmlContent) {
          res.status(404).send('Page not found');
          return;
        }
        const htmlContent = await vite.transformIndexHtml(
          reqUrl,
          rawHtmlContent,
          reqUrl,
        );

        const renderedHtml = await renderSsgHtmlForPage({
          html: htmlContent,
          page: pages[pageName],
          loadModule: id => vite.ssrLoadModule(id),
          readSource: id => readFileSync(id, 'utf-8'),
        });

        res.status(200).send(renderedHtml);
      }
      else {
        let list = '';
        for (const page of Object.keys(pages)) {
          const { title } = pages[page];
          const pageUrl = pageBasePath === '/'
            ? `/${page}.html`
            : `${pageBasePath}/${page}.html`;
          list += `<li><a href="${pageUrl}">${title}: ${page}</a></li>`;
        }
        res.status(404).send(`<div>
            <h1>Page not found, you can go to:</h1>
            <ul>${list}</ul>
            </div>`);
      }
    });

    app.use(vite.middlewares);

    app.listen(port, host, () => {
      logDevServer({
        port,
        isHttps: false,
        ip: ipv4,
      });
      this.onAfterCompile();
    });
  };

  build = async (): Promise<void> => {
    const cfg = await getCfg(this.cfg, Environment.prod, {
      onModifyBundlerConfig: this.onModifyBundlerConfig,
    });

    await build(cfg);
    if (!hasSsgEnabledPages({
      pages: cfg.sharedConfig.pages,
      readSource: id => readFileSync(id, 'utf-8'),
    })) {
      this.onAfterCompile();
      return;
    }

    const vite = await createViteServer({
      ...cfg,
      appType: 'custom',
      optimizeDeps: {
        ...cfg.optimizeDeps,
        noDiscovery: true,
      },
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
    });

    await prerenderSsgPages({
      outDir: resolve(this.cfg.config.cwd, cfg.build?.outDir || this.cfg.config.outputPath),
      pages: cfg.sharedConfig.pages,
      loadModule: id => vite.ssrLoadModule(id),
      readSource: id => readFileSync(id, 'utf-8'),
      readHtml: id => readFileSync(id, 'utf-8'),
      writeHtml: (id, html) => {
        writeFileSync(id, html);
      },
    });
    await vite.close();
    this.onAfterCompile();
  };
}

export type { BundlerViteOptions } from './types';
