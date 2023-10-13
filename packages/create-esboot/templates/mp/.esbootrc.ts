import { defineConfig, CodeSplittingType } from '@dz-web/esboot';

export default defineConfig((runtimeCfg) => ({
  TSChecker: false,
  // port: 8081,
  analyze: false,
  /**
   * 调试库兼容性问题时，可以关闭mfsu
   */
  mfsu: false,
  pxtorem: {
    enable: true,
    // root rem设置为200，编译生成的值，心算的时候x rem X 100即可得到在375px浏览器下的px值
    // 如375px编译为1.875rem，心算时1.875rem X 100 = 187.5px, 即在375浏览器窗口下，半屏宽度
    rootValue: runtimeCfg.isMobile ? 200 : 13,
  },
  extraBabelIncludes: [
    /filter-obj/i,
    /immer/i,
    /zustand/i,
    /query-string/i,
    /react-intl/i,
    /common/i,
    /d3-/i,
    /@tanstack/i,
    /@react-spring/i,
    /@floating-ui/i,
  ],
  codeSplitting: {
    jsStrategy: CodeSplittingType.granularChunks,
    jsStrategyOptions: {
      // 为了提高首屏速度，我们把一些非常非常常用的库打进公共代码库里, 不常用的让跟着页面js加载，以免影响大部分小页面的加载与js解析速度
      frameworkBundles: [
        // 不要添加router进来，我们绝大多数页面都是嵌入到webview中用的小页面，不需要router，所以router不需要打进公共代码库里。会影响大部分页面的加载速度
        '@dz-web/bridge',
        '@dz-web/request',
        'dayjs',
        '@tanstack/react-query',
        'redux',
        'redux-thunk',
        'react-redux',
        '@reduxjs/toolkit',
        'zustand',
        'immer',
        'lodash',
        'nanoid',
        '@dz-web/axios',
        '@dz-web/axios-middlewares',
        'axios',
        'react-intl',
        '@loadable/component',
        'classnames',
        'perfect-scrollbar',
      ]
    },
  },
  define: {
    'process.env.isMobile': runtimeCfg.isMobile as any,
    'process.env.isBrowser': runtimeCfg.isBrowser as any,
  },
}));

export const afterHooks = (cfg) => {
  console.log(cfg.entry, '<-- cfg');
}