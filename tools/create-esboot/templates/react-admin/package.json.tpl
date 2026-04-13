{
  "name": "esboot-react-admin",
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
    "@ant-design/icons": "^6.1.0",
    "@dz-web/antd-pro-components": "^3.0.12",
    "@dz-web/axios": "^0.0.6",
    "@dz-web/axios-middlewares": "^1.3.0",
    "@dz-web/cache": "^2.0.0",
    "@dz-web/esboot-browser": "^4.2.0",
    "@dz-web/esboot-browser-react": "^4.2.0",
    "@loadable/component": "^5.16.7",
    "@tanstack/react-query": "^5.91.3",
    "ahooks": "^3.9.7",
    "antd": "^6.3.5",
    "axios": "^1.15.0",
    "crypto-js": "^4.2.0",
    "dayjs": "^1.11.20",
    "lodash-es": "^4.18.1",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-hook-form": "^7.72.1",
    "react-intl": "^10.1.1",
    "react-router-dom": "^7.14.0",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.2.0",
    "@dz-web/esboot-bundler-vite": "^4.2.0",
    "@dz-web/esboot-plugin-vitest": "^4.2.0",
    "@types/loadable__component": "^5.13.10",
    "@types/lodash-es": "^4.17.12",
    "@types/node": "^25.6.0",
    "@types/react": "19.2.14",
    "@types/react-dom": "^19.2.3",
    "eslint": "^10.2.0",
    "stylelint": "^17.7.0"
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
  "esbootTemplateGitHash": "5e050a8be4fe3e16d7fae8fcba009b58059c2a6a"
}