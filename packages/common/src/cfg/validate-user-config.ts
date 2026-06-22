import type { LocalsConvention, UserOptions } from './types';
import type { Plugin } from '@/plugin/type';
import { z } from 'zod';
import { CSSMinifier, JsMinifier } from '@/constants';

export class ConfigLoadError extends Error {
  filePath: string;
  issues: Array<{ path: string; message: string }>;

  constructor(
    message: string,
    options: {
      filePath: string;
      issues: Array<{ path: string; message: string }>;
    },
  ) {
    super(message);
    this.name = 'ConfigLoadError';
    this.filePath = options.filePath;
    this.issues = options.issues;
  }
}

const primitiveValueSchema = z.union([z.string(), z.boolean(), z.number()]);
const localsConventionSchema = z.custom<LocalsConvention>((value) => {
  return typeof value === 'function'
    || ['camelCase', 'camelCaseOnly', 'asIs', 'dashes', 'dashesOnly'].includes(value as string);
});

const px2remSchema = z.object({
  enable: z.boolean().optional(),
  rootValue: z.union([z.number(), z.record(z.string(), z.number())]).optional(),
  unitPrecision: z.number().optional(),
  propWhiteList: z.array(z.string()).optional(),
  propBlackList: z.array(z.string()).optional(),
  exclude: z.union([
    z.string(),
    z.instanceof(RegExp),
    z.array(z.union([z.string(), z.instanceof(RegExp)])),
  ]).optional(),
  selectorBlackList: z.array(z.string()).optional(),
  ignoreIdentifier: z.union([z.boolean(), z.string()]).optional(),
  replace: z.boolean().optional(),
  mediaQuery: z.boolean().optional(),
  minPixelValue: z.number().optional(),
}).passthrough();

const proxySchema = z.object({
  context: z.array(z.string()),
  target: z.string(),
  changeOrigin: z.boolean().optional(),
  pathRewrite: z.record(z.string(), z.string()).optional(),
}).passthrough();

const userConfigSchema = z.object({
  isSP: z.boolean().optional(),
  outputPath: z.string().optional(),
  publicPath: z.string().optional(),
  useLangJsonPicker: z.boolean().optional(),
  minimize: z.boolean().optional(),
  jsMinifier: z.nativeEnum(JsMinifier).optional(),
  jsMinifierOptions: z.record(z.string(), z.any()).optional(),
  cssMinifier: z.nativeEnum(CSSMinifier).optional(),
  cssMinifierOptions: z.record(z.string(), z.any()).optional(),
  analyze: z.boolean().optional(),
  alias: z.record(z.string(), z.string()).optional(),
  define: z.record(z.string(), primitiveValueSchema).optional(),
  sourceMap: z.boolean().optional(),
  copy: z.record(z.string(), z.string()).optional(),
  css: z.object({
    modules: z.object({
      useStyleName: z.boolean().optional(),
      localsConvention: localsConventionSchema.optional(),
    }).passthrough().optional(),
    tailwind: z.object({
      enable: z.boolean().optional(),
      version: z.enum(['3', 'next']).optional(),
      separateImports: z.boolean().optional(),
    }).passthrough().optional(),
  }).passthrough().optional(),
  px2rem: px2remSchema.optional(),
  svgr: z.boolean().optional(),
  svgrOptions: z.record(z.string(), z.any()).optional(),
  assetsInlineLimit: z.number().optional(),
  server: z.object({
    host: z.string().optional(),
    https: z.boolean().optional(),
    http2: z.boolean().optional(),
    open: z.boolean().optional(),
    port: z.number().optional(),
    proxy: z.array(proxySchema).optional(),
  }).passthrough().optional(),
  legacy: z.boolean().optional(),
  externals: z.record(z.string(), z.string()).optional(),
  plugins: z.array(z.custom<Plugin>()).optional(),
  experimental: z.object({
    reactCompiler: z.object({
      enable: z.boolean().optional(),
      target: z.enum(['18', '19']),
    }).passthrough().optional(),
  }).passthrough().optional(),
}).passthrough();

export function validateUserConfig(
  config: unknown,
  filePath = '.esbootrc.ts',
): UserOptions & Record<string, unknown> {
  const result = userConfigSchema.safeParse(config);

  if (result.success) {
    return result.data;
  }

  const issues = result.error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
      return {
        path,
        message: issue.message,
      };
    });

  throw new ConfigLoadError('esboot config load error', {
    filePath,
    issues,
  });
}
