export async function monitorPerformance(): Promise<void> {
  const ReactScan = await import('react-scan');
  console.log(ReactScan, 'ReactScan');
  const { scan } = ReactScan;

  scan({
    enabled: true,
    showToolbar: true,
    showFPS: true,
  });
}
