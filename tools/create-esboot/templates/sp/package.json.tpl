{
  "name": "esboot-react-sp",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "esboot dev",
    "dev:vite": "cross-env ESBOOT_BUNDLER=vite esboot dev",
    "build": "esboot build",
    "esboot": "esboot",
    "prepare": "esboot prepare"
  },
  "author": "Roc",
  "license": "ISC",
  "dependencies": {
    "@dz-web/axios": "0.0.6",
    "@dz-web/axios-middlewares": "1.0.3",
    "@dz-web/esboot-browser": "^3.0.38",
    "@tanstack/react-query": "5.66.0",
    "ahooks": "3.8.4",
    "antd": "5.24.7",
    "axios": "1.8.4",
    "classnames": "2.5.1",
    "lodash-es": "4.17.21",
    "react": "19.1.0",
    "react-dom": "19.0.0",
    "react-intl": "7.1.11",
    "react-router": "7.5.1",
    "zustand": "5.0.3"
  },
  "devDependencies": {
    "@dz-web/esboot": "3.0.38",
    "@dz-web/esboot-bundler-vite": "3.0.38",
    "@dz-web/esboot-bundler-webpack": "3.0.38",
    "@dz-web/esboot-plugin-docs": "^3.0.38",
    "@dz-web/esboot-plugin-vitest": "^3.0.38",
    "@types/node": "22.13.17",
    "@types/react": "19.0.14",
    "@types/react-dom": "19.0.6",
    "cross-env": "^7.0.3",
    "eslint": "8.57.1",
    "stylelint": "15.11.0"
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
  },
  "esbootTemplateGitHash": "283e542b026e4477001c2bdd81834b4df8a70066"
}