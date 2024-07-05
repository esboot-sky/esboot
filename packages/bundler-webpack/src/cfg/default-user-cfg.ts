import { DEFAULT_DEV_PORT } from '@dz-web/esboot-common/constants';
import { JsMinifier, CSSMinifier, CodeSplittingType } from './types';

export const defaultUserOpts = {
  mfsu: true,
  analyze: false,
  proxy: {},
  https: false,
  http2: false,
  TSChecker: false,
  outputPath: 'dist',
  open: false,
  port: DEFAULT_DEV_PORT,
  extraBabelPlugins: [],
  extraBabelPresets: [],
  extraBabelIncludes: [],
  pxtorem: {},
  jsMinifier: JsMinifier.terser,
  jsMinifierOptions: {},
  cssMinifier: CSSMinifier.cssnano,
  cssMinifierOptions: {},
  codeSplitting: {
    jsStrategy: CodeSplittingType.granularChunks,
    jsStrategyOptions: {},
  },
  alias: {
    '@mobile-native': 'src/platforms/mobile/_native',
    '@mobile-browser': 'src/platforms/mobile/_browser',
    '@pc-native': 'src/platforms/pc/_native',
    '@pc-browser': 'src/platforms/pc/_browser',
    '@mobile': 'src/platforms/mobile',
    '@pc': 'src/platforms/pc',
    '@': 'src',
  },
  svgr: true,
} satisfies any;
