export default function loggerLoader(source: string): string {
  const module = this._module;
  console.log('logger-loader', module.context);
  return source;
}
