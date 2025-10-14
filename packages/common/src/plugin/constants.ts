export enum PluginHooks {
  registerCommands = 'registerCommands',
  prepare = 'prepare',
  modifyConfig = 'modifyConfig',
  modifyTypescriptConfig = 'modifyTypescriptConfig',
  modifyPrettierConfig = 'modifyPrettierConfig',
  modifyStylelintConfig = 'modifyStylelintConfig',
  modifyEslintConfig = 'modifyEslintConfig',
  modifyBundlerConfig = 'modifyBundlerConfig',
  afterCompile = 'afterCompile',
}
