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

    const classNames = [className];
    for (const item of styleName.split(' ')) {
      classNames.push(
        ...classVariables.map((variable) => {
          if (variable[item]) return variable[item];
          return variable[
            item.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
          ];
        }),
      );
    }

    props.className = classNames.join(' ');

    delete props.styleName;
  }
  return origCreateElement(name, props, ...extra);
}
