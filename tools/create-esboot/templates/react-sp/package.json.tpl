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
    "@dz-web/esboot-browser": "^4.4.6",
    "@dz-web/esboot-browser-react": "^4.4.6",
    "@tanstack/react-query": "^5.101.2",
    "ahooks": "^3.9.7",
    "antd": "^6.5.1",
    "axios": "^1.18.1",
    "lodash-es": "^4.18.1",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-intl": "^10.1.16",
    "react-router": "^7.18.1",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.4.6",
    "@dz-web/esboot-bundler-vite": "^4.4.6",
    "@dz-web/esboot-plugin-vitest": "^4.4.6",
    "@types/node": "^25.5.0",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "eslint": "^10.7.0",
    "stylelint": "^17.14.0"
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
  "esbootTemplateGitHash": "206664df7507f4327d29a574197943555e20994c"
}