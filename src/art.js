export function mandala(className = 'mandala') {
  const rings = [
    { r: 38, n: 8, len: 24, w: 11 },
    { r: 68, n: 12, len: 30, w: 12 },
    { r: 104, n: 16, len: 34, w: 13 },
    { r: 144, n: 24, len: 36, w: 11 },
    { r: 186, n: 36, len: 28, w: 8 },
  ];
  const groups = rings
    .map((ring, i) => {
      const tip = -ring.r - ring.len;
      const petal = `M0 ${-ring.r} C ${ring.w} ${-ring.r - ring.len * 0.35} ${ring.w * 0.6} ${-ring.r - ring.len * 0.85} 0 ${tip} C ${-ring.w * 0.6} ${-ring.r - ring.len * 0.85} ${-ring.w} ${-ring.r - ring.len * 0.35} 0 ${-ring.r} Z`;
      const offset = i % 2 ? 180 / ring.n : 0;
      const petals = Array.from(
        { length: ring.n },
        (_, k) => `<path pathLength="1" d="${petal}" transform="rotate(${(360 / ring.n) * k + offset})"/>`,
      ).join('');
      return `<g class="ring ring-${i}" style="--r:${i}">${petals}<circle pathLength="1" r="${ring.r}"/></g>`;
    })
    .join('');
  return `<svg class="${className}" viewBox="-230 -230 460 460" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-width="1.1">
      ${groups}
      <circle r="222" stroke-dasharray="2 7"/>
      <circle r="14" fill="currentColor" fill-opacity="0.35"/>
    </g>
  </svg>`;
}

export const corner = () => `<svg class="corner-svg" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
  <path d="M2 58V20C2 10 10 2 20 2h38"/>
  <path d="M8 58V24c0-9 7-16 16-16h34"/>
  <path d="M14 34c0-11 8-20 19-20 6 0 10 4 10 9s-4 8-8 8-6-3-6-6 2-4 4-4"/>
  <circle cx="8" cy="8" r="3" fill="currentColor"/>
</svg>`;

export const divider = () => `<svg class="divider" viewBox="0 0 240 24" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="1">
    <path pathLength="1" d="M0 12h88M152 12h88"/>
    <path d="M120 3l9 9-9 9-9-9z"/>
    <path d="M120 7l5 5-5 5-5-5z" fill="currentColor"/>
    <path d="M96 12c4-7 9-7 12 0-3 7-8 7-12 0zM144 12c-4-7-9-7-12 0 3 7 8 7 12 0z"/>
  </g>
  <circle cx="90" cy="12" r="1.6" fill="currentColor"/>
  <circle cx="150" cy="12" r="1.6" fill="currentColor"/>
</svg>`;

export const bell = (id) => `<svg class="bell-svg" viewBox="0 0 60 150" aria-hidden="true">
  <defs>
    <linearGradient id="${id}" x1="0" x2="1">
      <stop offset="0" stop-color="#8a5f22"/><stop offset=".45" stop-color="#f6dfa0"/><stop offset="1" stop-color="#9c6d2a"/>
    </linearGradient>
  </defs>
  <path d="M30 0v66" stroke="#d4a24c" stroke-width="2" stroke-dasharray="4 3"/>
  <circle cx="30" cy="70" r="5" fill="none" stroke="#d4a24c" stroke-width="2"/>
  <path d="M30 75c-12 0-16 14-16 30l-5 14h42l-5-14c0-16-4-30-16-30z" fill="url(#${id})"/>
  <rect x="7" y="117" width="46" height="6" rx="3" fill="#b08133"/>
  <circle class="clapper" cx="30" cy="130" r="5.5" fill="#d4a24c"/>
</svg>`;

const svg = (body, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const icons = {
  diya: () =>
    svg(`<path class="flame" d="M16 4c2.2 3.2 3.2 4.8 3.2 6.8a3.2 3.2 0 0 1-6.4 0c0-2 1-3.6 3.2-6.8z"/>
      <path d="M3.5 17c0 5 5.6 8.2 12.5 8.2S28.5 22 28.5 17z"/><path d="M12 25.2 10.5 28h11L20 25.2"/>`, 'icon ceremony'),
  fire: () =>
    svg(`<path class="flame" d="M16 3c1.2 4 5.5 5.2 5.5 10.2a5.5 5.5 0 0 1-11 0c0-2.2 1-3.4 2.2-4.4 0 2.2 1.1 3.3 2.2 3.3-1-3.2 0-6.3 1.1-9.1z"/>
      <path d="M6 22h20M8 22l2 6h12l2-6"/>`, 'icon ceremony'),
  kalasha: () =>
    svg(`<ellipse cx="16" cy="7.5" rx="3.4" ry="4"/>
      <path d="M12.5 11c-3-1.2-5-3-6-5.4 3 0 5.2 1.2 6.2 3.2M19.5 11c3-1.2 5-3 6-5.4-3 0-5.2 1.2-6.2 3.2"/>
      <path d="M11.5 12.5h9v2.2h-9z"/><path d="M11 14.7c-3.4 2-5 5-5 8 0 4 4.2 6.8 10 6.8s10-2.8 10-6.8c0-3-1.6-6-5-8"/>
      <path d="M7 21.5h18"/>`, 'icon ceremony'),
  calendar: () => svg(`<rect x="5" y="7" width="22" height="20" rx="3"/><path d="M5 13h22M11 4v6M21 4v6"/>`),
  pin: () => svg(`<path d="M16 29s9-8.2 9-15a9 9 0 0 0-18 0c0 6.8 9 15 9 15z"/><circle cx="16" cy="14" r="3.2"/>`),
  phone: () =>
    svg(`<path d="M8 4h4l2 6-3 2a15 15 0 0 0 9 9l2-3 6 2v4a2 2 0 0 1-2 2C14 26 6 18 6 6a2 2 0 0 1 2-2z"/>`),
  chat: () =>
    svg(`<path d="M5 26l1.8-5.2A10.5 10.5 0 1 1 11 25z"/><path d="M12 12.5c.5 3 3.5 6 6.5 6.8l1.6-1.6 2.4 1.2"/>`),
  share: () =>
    svg(`<circle cx="23" cy="7" r="3.5"/><circle cx="9" cy="16" r="3.5"/><circle cx="23" cy="25" r="3.5"/><path d="M12 14.3l8-5.6M12 17.7l8 5.6"/>`),
  heart: () => svg(`<path d="M16 27S4 19.5 4 11.5A6 6 0 0 1 16 9a6 6 0 0 1 12 2.5C28 19.5 16 27 16 27z"/>`),
};

export function toran(strands = 17) {
  const items = Array.from({ length: strands }, (_, i) => {
    const beads = 4 + ((i * 7) % 4);
    const beadHTML = Array.from(
      { length: beads },
      (_, b) => `<span class="bead" style="--c:${b % 2 ? '#ffc93c' : '#f28c28'}"></span>`,
    ).join('');
    return `<span class="strand" style="--d:${(i % 5) * -0.7}s">${beadHTML}<span class="leaf"></span></span>`;
  }).join('');
  const leaves = Array.from({ length: strands * 2 }, () => '<span class="mango"></span>').join('');
  return `<div class="toran" aria-hidden="true"><div class="toran-rope">${leaves}</div><div class="toran-strands">${items}</div></div>`;
}
