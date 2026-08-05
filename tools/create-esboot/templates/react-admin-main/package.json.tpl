{
  "name": "esboot-react-sp",
  "version": "1.0.0",
  "description": "",
  "author": "Roc",
  "license": "ISC",
  "main": "index.js",
  "scripts": {
    "dev": "esboot dev",
    "build": "esboot build",
    "esboot": "esboot",
    "test": "esboot vitest run",
    "postinstall": "esboot prepare"
  },
  "dependencies": {
    "@ant-design/cssinjs": "^2.1.2",
    "@ant-design/icons": "^6.3.2",
    "@dz-web/antd-pro-components": "^3.0.13",
    "@dz-web/axios": "^0.0.6",
    "@dz-web/axios-middlewares": "^1.3.0",
    "@dz-web/cache": "^2.0.0",
    "@dz-web/esboot-browser": "^4.4.7",
    "@dz-web/esboot-browser-react": "^4.4.7",
    "@loadable/component": "^5.16.7",
    "@tanstack/react-query": "^5.101.4",
    "ahooks": "^3.9.7",
    "antd": "^6.5.3",
    "axios": "^1.19.0",
    "crypto-js": "^4.2.0",
    "dayjs": "^1.11.21",
    "lodash-es": "^4.18.1",
    "qiankun": "^2.10.16",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-hook-form": "^7.84.0",
    "react-intl": "^10.1.20",
    "react-router-dom": "^7.18.2",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.4.7",
    "@dz-web/esboot-bundler-vite": "^4.4.7",
    "@dz-web/esboot-plugin-vitest": "^4.4.7",
    "@types/loadable__component": "^5.13.10",
    "@types/lodash-es": "^4.17.12",
    "@types/node": "^26.1.2",
    "@types/react": "19.2.18",
    "@types/react-dom": "^19.2.4",
    "eslint": "^10.8.0",
    "stylelint": "^17.14.1"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "eslint",
    "*.{scss,css}": "stylelint"
  },
  "stylelint": {
    "extends": [
      "./node_modules/.cache/esboot/stylelint"
    ]
  },
  "commitlint": {
    "extends": [
      "./node_modules/.cache/esboot/commitlint"
    ]
  },
  "prettier": "./node_modules/.cache/esboot/prettier",
  "browserslist": {
    "development": [
      "last 1 chrome version"
    ],
    "production": [
      "Chrome >= 111"
    ]
  },
  "esbootTemplateGitHash": "54fd7c4247c4197b172c054223b15c3d00018b42"
}