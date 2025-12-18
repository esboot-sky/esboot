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
    "prepare": "esboot prepare"
  },
  "dependencies": {
    "@dz-web/axios": "0.0.6",
    "@dz-web/axios-middlewares": "1.3.0",
    "@dz-web/esboot-browser": "^4.0.0-alpha.11",
    "@dz-web/esboot-browser-react": "4.0.0-alpha.11",
    "@tanstack/react-query": "5.90.7",
    "ahooks": "3.9.6",
    "antd": "5.28.1",
    "axios": "1.13.2",
    "lodash-es": "4.17.21",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-intl": "7.1.14",
    "react-router": "7.9.5",
    "zustand": "5.0.8"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.0.0-alpha.11",
    "@dz-web/esboot-bundler-vite": "^4.0.0-alpha.11",
    "@dz-web/esboot-plugin-docs": "^4.0.0-alpha.11",
    "@dz-web/esboot-plugin-vitest": "^4.0.0-alpha.11",
    "@types/node": "24.10.0",
    "@types/react": "19.2.3",
    "@types/react-dom": "19.2.2",
    "cross-env": "^10.1.0",
    "eslint": "9.39.1",
    "stylelint": "16.25.0"
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
  "esbootTemplateGitHash": "12133bb59df588dfe9a0fa55e66a887a40e79e20"
}