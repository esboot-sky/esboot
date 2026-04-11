import type { ReactElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

interface MountReactAppOptions {
  containerId?: string;
  hydrate?: boolean;
}

export function mountReactApp(
  innerApp: ReactElement,
  options: MountReactAppOptions = {},
): void {
  const { containerId = 'root', hydrate = false } = options;
  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error(`Cannot find mount container "#${containerId}".`);
  }

  if (hydrate) {
    hydrateRoot(container, innerApp);
    return;
  }

  createRoot(container).render(innerApp);
}
