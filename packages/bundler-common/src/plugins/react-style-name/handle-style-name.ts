export { transformJSXStyleName } from './jsx-style-name';
export { getTransformerSource } from './runtime-helpers';
export { findStyleImports, makeVariableName } from './style-imports';

export function REACT_CREATE_ELEMENT_REGEX_GENERATOR(reactVariableName: string): RegExp {
  return new RegExp(
    `(${reactVariableName}\\.createElement|_?jsx|_?jsxs|_?jsxDEV)\\(`,
    'g',
  );
}
