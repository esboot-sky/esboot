{
  "name": "esboot-react-sp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "esboot dev",
    "build": "esboot build",
    "esboot": "esboot",
    "prepare": "esboot prepare"
  },
  "author": "Roc",
  "license": "ISC",
  "dependencies": {
    "@ant-design/icons": "^5.4.0",
    "@ant-design/pro-components": "^2.7.14",
    "@dz-web/axios": "^0.0.6",
    "@dz-web/axios-middlewares": "^1.0.3",
    "@dz-web/esboot-browser": "^4.3.0",
    "@dz-web/esboot-browser-react": "^4.3.0",
    "@dz-web/cache": "^2.0.0",
    "@loadable/component": "^5.16.4",
    "@tanstack/react-query": "^5.51.11",
    "ahooks": "^3.8.0",
    "antd": "^5.19.3",
    "axios": "^1.7.2",
    "class-variance-authority": "^0.7.0",
    "classnames": "^2.5.1",
    "clsx": "^2.1.1",
    "crypto-js": "^4.2.0",
    "lodash-es": "^4.17.21",
    "qiankun": "^2.10.16",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.52.1",
    "react-intl": "^6.6.8",
    "react-router-dom": "^6.25.1",
    "tailwind-merge": "^2.4.0",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.3.0",
    "@dz-web/esboot-bundler-vite": "^4.3.0",
    "@dz-web/esboot-plugin-vitest": "^4.3.0",
    "@types/node": "^20.14.11",
    "@types/react": "18.3.3",
    "@types/react-dom": "^18.3.0",
    "eslint": "^10.2.1",
    "stylelint": "^17.9.1"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "eslint",
    "*.{scss,css}": "stylelint"
  },
  "stylelint": {
    "extends": [
      "@dz-web/esboot/config/stylelint"
    ]
  },
  "commitlint": {
    "extends": [
      "./node_modules/@dz-web/esboot/config/commitlint/index.js"
    ]
  },
  "prettier": "./node_modules/.cache/esboot/prettier/index.json",
  "browserslist": {
    "development": [
      "last 1 chrome version"
    ],
    "production": [
      "Chrome >= 111"
    ]
  },
  "esbootTemplateGitHash": "207240bf67355e370ad5d21867a05b6e72950891"
}