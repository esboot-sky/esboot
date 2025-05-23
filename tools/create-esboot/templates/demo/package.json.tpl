{
  "name": "esboot-react-demo",
  "version": "1.0.0",
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
    "@dz-web/esboot-browser": "^3.0.36",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-router": "7.1.5"
  },
  "devDependencies": {
    "@dz-web/esboot": "^3.0.36",
    "@dz-web/esboot-bundler-vite": "^3.0.36",
    "@types/node": "22.13.1",
    "@types/react": "19.0.8",
    "@types/react-dom": "19.0.3",
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
  "esbootTemplateGitHash": "ddc6fbe7e4d6cb64eb18dfddc4e709986ebf595c"
}