interface CreateExternalConsoleOptions {
  enabled?: boolean;
  timeout?: number;
  resourceUrl?: string;
}

export function createExternalConsole(options: CreateExternalConsoleOptions = {}): Promise<typeof window.eruda.init | false> {
  const {
    enabled = window?.GLOBAL_CONFIG?.debug ?? false,
    timeout = 10000,
    resourceUrl = 'https://cdn.jsdelivr.net/npm/eruda',
  } = options;

  if (!enabled || !resourceUrl)
    return Promise.resolve(false);

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = resourceUrl;
    script.async = true;
    let eruda: typeof window.eruda.init;

    const timeoutId = setTimeout(() => {
      resolve(false);
    }, timeout);

    script.onload = () => {
      clearTimeout(timeoutId);
      eruda = window.eruda.init as typeof window.eruda.init;
      resolve(eruda);
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      resolve(false);
    };

    window.document.body.appendChild(script);
  });
};
