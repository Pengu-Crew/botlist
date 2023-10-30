export function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getDiferency(timestamp: number, hours: number) {
  return new Date().getTime() - timestamp > 1 * hours * 60 * 60 * 1000;
}
