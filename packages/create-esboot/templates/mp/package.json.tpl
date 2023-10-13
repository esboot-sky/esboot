{
  "name": "esboot-react-mp",
  "version": "2.0.0",
  "testVersion": 1,
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "esboot dev",
    "build": "esboot build",
    "esboot": "esboot",
    "postinstall": "esboot exec husky install && esboot g-alias"
  },
  "author": "{{{ author }}}",
  "license": "ISC",
  "dependencies": {
    "@dz-web/axios": "^0.0.6",
    "@dz-web/axios-middlewares": "^0.1.1",
    "@dz-web/bridge": "^2.2.10",
    "@dz-web/cache": "^2.0.0",
    "@dz-web/o-orange": "^3.7.14",
    "@dz-web/request": "^0.1.12",
    "@loadable/component": "^5.15.3",
    "@reduxjs/toolkit": "^1.9.6",
    "@tanstack/react-query": "^4.35.3",
    "@websaber/string-utils": "^0.0.1",
    "ahooks": "^3.7.8",
    "antd": "^5.9.2",
    "antd-mobile": "^5.32.4",
    "axios": "^1.5.0",
    "classnames": "^2.3.2",
    "core-js": "^3.32.2",
    "eventemitter3": "^5.0.1",
    "immer": "^10.0.2",
    "lodash-es": "^4.17.21",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-fast-compare": "^3.2.2",
    "react-intl": "^6.4.7",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.16.0"
  },
  "devDependencies": {
    "@dz-web/esboot": "^2.7.0",
    "@types/dz-web": "^1.0.1",
    "@types/lodash-es": "^4.17.9",
    "@types/node": "^20.6.5",
    "@types/react": "18.2.22",
    "@types/react-dom": "^18.2.7",
    "eslint": "^8.50.0",
    "stylelint": "^15.10.3"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "eslint",
    "*.{scss,css}": "stylelint"
  },
  "eslintConfig": {
    "extends": [
      "./node_modules/@dz-web/esboot/config/eslint"
    ]
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
  "prettier": "@dz-web/esboot/config/prettier/index.json",
  "browserslist": {
    "development": [
      "last 1 chrome version"
    ],
    "pc-native-production": [
      "Chrome >= 67"
    ],
    "pc-browser-production": [
      "Chrome >= 67"
    ],
    "mobile-native-production": [
      "ChromeAndroid >= 75",
      "ios_saf >= 10"
    ],
    "mobile-browser-production": [
      "ChromeAndroid >= 75",
      "ios_saf >= 10"
    ]
  }
}
