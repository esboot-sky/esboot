interface MonitorPerformanceOptions {
  enabledReactScan?: boolean;
  showToolbar?: boolean;
  showFPS?: boolean;
}

export async function monitorPerformance(
  options: MonitorPerformanceOptions = {
    enabledReactScan: true,
    showToolbar: true,
    showFPS: true,
  },
): Promise<void> {
  const {
    enabledReactScan = true,
    showToolbar = true,
    showFPS = true,
  } = options || {};

  if (enabledReactScan) {
    const ReactScan = await import('react-scan');
    const { scan } = ReactScan;

    scan({
      enabled: enabledReactScan,
      showToolbar,
      showFPS,
    });
  }
}
