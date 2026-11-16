import { config } from './config.js';

const query = new URLSearchParams(window.location.search);

function firstParam(names) {
  for (const name of names) {
    const value = query.get(name);
    if (value && value.trim()) return value;
  }
  return '';
}

export function readGuestName() {
  const cleaned = firstParam(config.guest.params)
    .replace(/[<>{}[\]\\/`"=]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, config.guest.maxLength)
    .trim();
  return /\p{L}/u.test(cleaned) ? cleaned : '';
}

export function readSide() {
  const raw = firstParam(config.sideParams).trim().toLowerCase();
  return config.sideAliases[raw] || config.defaultSide;
}

export function shouldSkipCover() {
  return query.has('open');
}
