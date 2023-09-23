import esbootConfig from '@@/config';

export function afterHooks() {
  const { userOpts, compileTimeConfig } = esbootConfig;
  const { afterHooks: customAfterHooks } = userOpts;
  if (!customAfterHooks) return;

  customAfterHooks({
    ...compileTimeConfig,
  });
}
