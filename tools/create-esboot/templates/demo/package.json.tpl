{
  "name": "esboot-react-demo",
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
    "@dz-web/esboot-browser": "^4.0.0-alpha.11",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "react-router": "7.9.5"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.0.0-alpha.11",
    "@dz-web/esboot-bundler-vite": "^4.0.0-alpha.11",
    "@types/node": "24.10.0",
    "@types/react": "19.2.3",
    "@types/react-dom": "19.2.2",
    "eslint": "9.39.1",
    "stylelint": "16.25.0"
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
  "esbootTemplateGitHash": "a54d58cfe9828c92b9e9c47bae6d0b664d1ee11a"
}