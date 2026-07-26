export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
}
export function formatCompactCurrency(amount: number, currency = 'USD'): string {
  if (amount >= 1_000_000) return `${formatCurrency(amount / 1_000_000, currency)}M`;
  if (amount >= 1_000) return `${formatCurrency(amount / 1_000, currency)}K`;
  return formatCurrency(amount, currency);
}
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}
export function formatPercentage(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}
export function getInitials(name: string): string {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}
export function truncateText(text: string, maxLength = 100): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
}
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
export function formatPhone(phone: string): string {
  const c = phone.replace(/\D/g, '');
  if (c.length === 10) return `(${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6)}`;
  return phone;
}
