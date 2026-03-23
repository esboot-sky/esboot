{
  "name": "esboot-react-mp",
  "version": "1.0.0",
  "description": "",
  "author": "donghs <donghs@dztec.net>",
  "license": "ISC",
  "main": "index.js",
  "scripts": {
    "esboot": "esboot",
    "dev": "esboot dev",
    "dev:webpack": "cross-env ESBOOT_BUNDLER=webpack esboot dev",
    "build": "esboot build",
    "build:webpack": "cross-env ESBOOT_BUNDLER=webpack esboot build",
    "build:ci": "pnpm run test && esboot build",
    "test": "esboot vitest",
    "bridge-mock": "esboot mock:bridge",
    "prepare": "esboot prepare",
    "docs:dev": "esboot docs dev",
    "docs:build": "esboot docs build",
    "create-page": "esboot-react-mp-tools create-page"
  },
  "dependencies": {
    "@dz-web/axios": "^0.0.6",
    "@dz-web/axios-middlewares": "^1.3.0",
    "@dz-web/bridge": "^3.4.1",
    "@dz-web/cache": "^2.0.0",
    "@dz-web/esboot-browser": "^3.0.16",
    "@dz-web/o-orange": "^4.3.0",
    "@loadable/component": "^5.16.4",
    "@reduxjs/toolkit": "^1.9.6",
    "@tanstack/react-query": "^5.62.2",
    "@tanstack/react-query-devtools": "^5.62.2",
    "@websaber/string-utils": "^0.0.5",
    "ahooks": "^3.8.4",
    "antd-mobile": "^5.38.1",
    "axios": "^1.7.9",
    "core-js": "^3.39.0",
    "dayjs": "^1.11.13",
    "deepmerge": "^4.3.1",
    "eruda": "^3.4.3",
    "eventemitter3": "^5.0.1",
    "immer": "^11.0.1",
    "lodash-es": "^4.17.21",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-fast-compare": "^3.2.2",
    "react-intl": "^7.1.14",
    "react-router": "^7.10.1",
    "rsuite": "^6.1.0",
    "zustand": "^5.0.9"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.0.5",
    "@dz-web/esboot-bundler-vite": "^4.0.5",
    "@dz-web/esboot-bundler-webpack": "^4.0.5",
    "@dz-web/esboot-plugin-vitest": "^4.0.5",
    "@dz-web/esboot-react-mp-tools": "file:./dev/tools",
    "@types/lodash-es": "^4.17.12",
    "@types/node": "^25.0.1",
    "@types/react": "19.2.7",
    "@types/react-dom": "^19.2.3",
    "cross-env": "^10.1.0",
    "eslint": "^9.39.1",
    "stylelint": "^16.26.1",
    "typescript": "^5.9.3"
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
      "Chrome >= 100"
    ],
    "pc-native-production": [
      "Chrome >= 67"
    ],
    "pc-browser-production": [
      "Chrome >= 67"
    ],
    "mobile-native-production": [
      "ChromeAndroid >= 75",
      "ios_saf >= 12"
    ],
    "mobile-browser-production": [
      "ChromeAndroid >= 75",
      "ios_saf >= 12"
    ]
  },
  "volta": {
    "node": "22.12.0",
    "pnpm": "9.15.9"
  },
  "esbootTemplateGitHash": "2e245799b6c7622d3d485335378602966876aa4b"
}