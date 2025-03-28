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
    "@dz-web/esboot-browser": "{{ esbootVersion }}",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-router": "7.1.5"
  },
  "devDependencies": {
    "@dz-web/esboot": "{{ esbootVersion }}",
    "@dz-web/esboot-bundler-vite": "{{ esbootVersion }}",
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
  }
}
