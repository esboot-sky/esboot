{
  "name": "example-sp-base",
  "version": "1.0.0",
  "testVersion": 1,
  "description": "",
  "private": "true",
  "main": "index.js",
  "scripts": {
    "dev": "esboot dev",
    "build": "esboot build",
    "esboot": "esboot",
    "postinstall": "esboot prepare",
    "test": "esboot vitest"
  },
  "sideEffects": ["*.css", "*.less"],
  "author": "Roc",
  "license": "ISC",
  "dependencies": {
    "@dz-web/axios": "^0.0.6",
    "@dz-web/axios-middlewares": "^1.0.3",
    "@dz-web/esboot-browser": "^3.0.4",
    "@loadable/component": "^5.16.4",
    "@tanstack/react-query": "^5.49.2",
    "ahooks": "^3.8.0",
    "antd": "^5.21.4",
    "axios": "^1.7.2",
    "lodash-es": "^4.17.21",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-intl": "^6.6.8",
    "react-router-dom": "^6.24.1",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@dz-web/esboot": "^3.0.4",
    "@dz-web/esboot-bundler-vite": "^3.0.4",
    "@dz-web/esboot-bundler-webpack": "^3.0.4",
    "@dz-web/esboot-plugin-docs": "^3.0.4",
    "@dz-web/esboot-plugin-vitest": "^3.0.4",
    "@types/dz-web": "^1.0.1",
    "@types/node": "^20.14.9",
    "@types/react": "18.3.3",
    "@types/react-dom": "^18.3.0",
    "eslint": "^8.50.0",
    "stylelint": "^15.10.3"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "eslint",
    "*.{scss,css}": "stylelint"
  },
  "eslintConfig": {
    "extends": [
      "./node_modules/.cache/esboot/eslint"
    ]
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
      "Chrome >= 67"
    ]
  }
}