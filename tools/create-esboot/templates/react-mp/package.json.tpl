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
    "@dz-web/esboot-browser": "^4.2.0",
    "@dz-web/esboot-browser-react": "^4.2.0",
    "@dz-web/o-orange": "^4.6.4",
    "@tanstack/react-query": "^5.99.0",
    "@tanstack/react-query-devtools": "^5.99.0",
    "@websaber/string-utils": "^1.0.0",
    "ahooks": "^3.9.7",
    "antd-mobile": "^5.42.3",
    "axios": "^1.15.0",
    "dayjs": "^1.11.20",
    "deepmerge": "^4.3.1",
    "eventemitter3": "^5.0.4",
    "lodash-es": "^4.18.1",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-fast-compare": "^3.2.2",
    "react-intl": "^10.1.1",
    "react-router": "^7.14.0",
    "rsuite": "^6.1.2",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.2.0",
    "@dz-web/esboot-bundler-vite": "^4.2.0",
    "@dz-web/esboot-bundler-webpack": "^4.2.0",
    "@dz-web/esboot-plugin-vitest": "^4.2.0",
    "@dz-web/esboot-react-mp-tools": "file:./dev/tools",
    "@types/lodash-es": "^4.17.12",
    "@types/node": "^25.6.0",
    "@types/react": "19.2.14",
    "@types/react-dom": "^19.2.3",
    "cross-env": "^10.1.0",
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
    "pnpm": "10.28.1"
  },
  "esbootTemplateGitHash": "b31c4bbc9349053a641e2ce572bbc9c068cc364f"
}