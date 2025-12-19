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
    "@dz-web/esboot-browser": "latest",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-router": "7.11.0"
  },
  "devDependencies": {
    "@dz-web/esboot": "latest",
    "@dz-web/esboot-bundler-vite": "latest",
    "@types/node": "24.10.4",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "eslint": "9.39.2",
    "stylelint": "16.26.1"
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
  "esbootTemplateGitHash": "440c9afb96253cc79627067748ed15312c52e2e0"
}