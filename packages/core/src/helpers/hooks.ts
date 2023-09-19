import esbootConfig from '@@/config';

export function afterHooks() {
  const { userOpts, compileTimeCfg } = esbootConfig;
  const { afterHooks: customAfterHooks } = userOpts;
  if (!customAfterHooks) return;

  customAfterHooks({
    ...compileTimeCfg,
  });
}
