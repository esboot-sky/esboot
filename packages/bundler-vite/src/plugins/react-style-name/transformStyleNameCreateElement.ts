interface StyleProps {
  className?: string;
  styleName?: string;
}

export function TransformStyleNameCreateElement<Props extends StyleProps>(
  origCreateElement: (name: string, props: any, ...extra: any[]) => any,
  classVariables: { [name: string]: string }[],
  name: string,
  rawProps: Props,
  ...extra: any[]
) {
  const props = { ...rawProps };

  if (typeof props.styleName === 'string') {
    const { className, styleName } = props;

    let classNames = className?.trim() || '';

    const styleNameKeyMap: { [name: string]: string } = {};
    for (const item of classVariables) {
      Object.assign(styleNameKeyMap, item);
    }

    for (const item of styleName.split(' ')) {
      if (item in styleNameKeyMap) {
        classNames += ` ${styleNameKeyMap[item]}`;
      }
      else {
        console.warn(`styleName ${item} not found in classVariables`);
      }
    }

    props.className = classNames;
    delete props.styleName;
  }
  return origCreateElement(name, props, ...extra);
}
