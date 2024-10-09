const { resolve } = require('path');
const isWin = process.platform === 'win32';
const themeConfig = {
  actions: [
    {
      link: '/intro',
      text: 'Get Started',
      type: 'primary',
    },
    {
      link: 'https://esboot.dzfe.net',
      text: 'Explore ESBoot',
      openExternal: true,
      type: 'primary',
    },
  ],
  description: 'Be yourself, always!',
  footer: 'Made with 🤯 by ESBoot And LobeHub',
  name: 'ESBoot',
  title: 'ESBoot Docs',
  features: [
    {
      title: '⚡ Lightning Fast',
      description:
        'ESBoot offers blazing-fast performance with optimized configurations, allowing developers to focus on building great components and documentation.',
    },
    {
      title: '🚀 Easy to Use',
      description:
        'With a convention-based directory structure and sensible defaults, ESBoot enables developers to get started quickly with zero learning curve.',
    },
    {
      title: '🔧 Highly Extensible',
      description:
        'ESBoot provides a flexible architecture that allows easy customization and extension to meet the specific needs of your project.',
    },
  ],
};

exports.default = {
  alias: {
    '@': resolve(process.cwd(), './src'),
    'dumi-theme-lobehub': resolve(process.cwd(), './src'),
  },
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  define: {
    'process.env': process.env,
  },
  favicons: ['http://esboot.dzfe.net/img/logo.svg'],
  locales: [{ id: 'en-US', name: 'English' }],
  mfsu: isWin ? undefined : {},
  npmClient: 'pnpm',
  ssr: false,
  hash: true,
  styles: [
    `html, body { background: transparent;  }

  footer {
    display: none;
  }

  header img {
    margin-right: 10px;
  }

  header svg:first-of-type, header svg:nth-of-type(2) {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    html, body { background: #000; }
  }`,
  ],
  themeConfig,
  title: 'ESBoot Docs',
};
