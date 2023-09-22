{
  "name": "esboot-react-mp",
  "version": "1.0.0",
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
    "@dz-web/bridge": "^2.2.8",
    "@dz-web/o-orange": "^3.7.11",
    "@dz-web/request": "^0.1.10",
    "@loadable/component": "^5.15.3",
    "ahooks": "^3.7.7",
    "antd": "^5.6.2",
    "classnames": "^2.3.2",
    "core-js": "^3.31.0",
    "immer": "^10.0.2",
    "lodash-es": "^4.17.21",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-intl": "^6.4.4",
    "react-router-dom": "^6.14.0",
    "zustand": "^4.3.8"
  },
  "devDependencies": {
    "@dz-web/esboot": "^2.6.0",
    "@types/node": "^20.5.9",
    "@types/react": "18.2.14",
    "@types/react-dom": "^18.2.6",
    "eslint": "^8.43.0",
    "stylelint": "^15.9.0"
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
