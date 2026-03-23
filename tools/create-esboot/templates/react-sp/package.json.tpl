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
    "@dz-web/esboot-browser": "^4.0.3",
    "@dz-web/esboot-browser-react": "4.0.3",
    "@tanstack/react-query": "5.90.12",
    "ahooks": "3.9.6",
    "antd": "6.1.1",
    "axios": "1.13.2",
    "lodash-es": "4.17.22",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-intl": "8.0.4",
    "react-router": "7.11.0",
    "zustand": "5.0.9"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.0.3",
    "@dz-web/esboot-bundler-vite": "^4.0.3",
    "@dz-web/esboot-plugin-docs": "^4.0.3",
    "@dz-web/esboot-plugin-vitest": "^4.0.3",
    "@types/lodash-es": "^4.17.12",
    "@types/node": "24.10.0",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "cross-env": "^10.1.0",
    "eslint": "9.39.2",
    "stylelint": "16.26.1"
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
  "volta": {
    "node": "22.21.1",
    "pnpm": "10.26.0"
  },
  "esbootTemplateGitHash": "c7e541f97cfcdff82c9ad0b2c6a7bffb41b5ec83"
}