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
    "@dz-web/esboot-browser": "^4.4.6",
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "react-router": "^8.2.0"
  },
  "devDependencies": {
    "@dz-web/esboot": "^4.4.6",
    "@dz-web/esboot-bundler-vite": "^4.4.6",
    "@types/node": "24.10.4",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
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
  "esbootTemplateGitHash": "0556f9e4f03a98c9d0306c7a2f805f40e468d479"
}