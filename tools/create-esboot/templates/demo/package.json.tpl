{
  "name": "esboot-react-demo",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "esboot dev",
    "build": "esboot build",
    "esboot": "esboot",
    "prepare": "esboot prepare"
  },
  "author": "Roc",
  "license": "ISC",
  "dependencies": {
    "@dz-web/esboot-browser": "^3.0.38",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-router": "7.5.1"
  },
  "devDependencies": {
    "@dz-web/esboot": "^3.0.38",
    "@dz-web/esboot-bundler-vite": "^3.0.38",
    "@types/node": "22.14.1",
    "@types/react": "19.1.2",
    "@types/react-dom": "19.1.2",
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
      "last 1 chrome version"
    ]
  },
  "esbootTemplateGitHash": "903de06bba0d4fcaaf14a2a35676d72ba4d88cc8"
}