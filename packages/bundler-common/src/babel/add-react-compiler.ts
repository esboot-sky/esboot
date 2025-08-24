export const addReactCompiler = () => {
  return [
    [
      resolvePath('babel-plugin-react-compiler'),
      {
        target: '19',
      },
    ],
  ];
};
