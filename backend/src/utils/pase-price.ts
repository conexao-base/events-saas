export function parsePrice(value: string): number | null {
  if (!value) return null;

  const price = Number(value.replace(/\./g, "").replace(",", "."));

  return Number.isFinite(price) ? price : null;
}