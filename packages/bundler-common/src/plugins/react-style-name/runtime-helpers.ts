const STYLE_NAME_HELPER = `function __styleName(classVariables, styleName, className) {
  const classNames = [];
  if (className)
    classNames.push(className);
  if (typeof styleName === 'string') {
    for (const item of styleName.split(' ').filter(Boolean)) {
      for (const variable of classVariables) {
        classNames.push(
          variable[item]
          || variable[item.replace(new RegExp('-(\\\\w)', 'g'), (_, c) => (c ? c.toUpperCase() : ''))],
        );
      }
    }
  }
  return classNames.filter(Boolean).join(' ');
}`;

const CREATE_ELEMENT_HELPER = `function TransformStyleNameCreateElement(
  origCreateElement,
  classVariables,
  name,
  rawProps,
  ...extra
) {
  const props = { ...rawProps };

  if (typeof props.styleName === 'string') {
    const { className, styleName } = props;

    const classNames = [className];
    for (const item of styleName.split(' ')) {
      classNames.push(
        ...classVariables.map((variable) => {
          if (variable[item]) return variable[item];
          return variable[
            item.replace(/-(\\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
          ];
        }),
      );
    }

    props.className = classNames.join(' ');

    delete props.styleName;
  }

  return origCreateElement(name, props, ...extra);
}`;

export function getStyleNameHelperSource(): string {
  return STYLE_NAME_HELPER;
}

export function getTransformerSource(): string {
  return CREATE_ELEMENT_HELPER;
}
