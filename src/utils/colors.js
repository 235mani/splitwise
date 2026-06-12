export function getBadgeColor(idx, name) {
  const palette = ['#2563eb', '#e67e22', '#16a085', '#8e44ad', '#e74c3c', '#f1c40f', '#2ecc71', '#d35400', '#2980b9', '#c0392b', '#7f8c8d', '#34495e'];
  let color = palette[idx % palette.length];
  if (idx >= palette.length) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    color = palette[Math.abs(hash) % palette.length];
  }
  return color;
}

export function getTextColor(bgColor) {
  const c = bgColor.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 160 ? '#222' : '#fff';
}

export function hexToRgb(hex) {
  const c = hex.replace('#', '');
  const n = parseInt(c, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function darkenHex(hex, pct) {
  const { r, g, b } = hexToRgb(hex);
  const f = (v) => Math.max(0, Math.min(255, Math.floor(v * (1 - pct))));
  const rr = f(r).toString(16).padStart(2, '0');
  const gg = f(g).toString(16).padStart(2, '0');
  const bb = f(b).toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`;
}
