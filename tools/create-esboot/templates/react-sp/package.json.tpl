{
  "name": "ESBoot React SP",
  "version": "1.0.0",
  "description": "Single Platform Application by ESBoot",
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
    "@dz-web/axios": "^0.0.6",
    "@dz-web/axios-middlewares": "^1.3.0",
    "@dz-web/esboot-browser": "^4.2.0",
    "@dz-web/esboot-browser-react": "^4.2.0",
    "@tanstack/react-query": "^5.99.0",
    "ahooks": "^3.9.7",
    "antd": "^6.3.5",
    "axios": "^1.15.0",
    "lodash-es": "^4.18.1",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-intl": "^10.1.1",
    "react-router": "^7.14.0",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.2.0",
    "@dz-web/esboot-bundler-vite": "^4.2.0",
    "@dz-web/esboot-plugin-vitest": "^4.2.0",
    "@types/node": "^25.6.0",
    "@types/react": "^19.2.14",
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
      "last 1 chrome version"
    ]
  },
  "volta": {
    "node": "22.21.1",
    "pnpm": "10.26.0"
  },
  "esbootTemplateGitHash": "9866e0eb9f8a509a971bd2a9b79c764ac047918d"
}