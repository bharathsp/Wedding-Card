import './styles.css';
import { config } from './config.js';

const form = document.getElementById('links-form');
const output = document.getElementById('links-out');
const baseUrl = new URL('./', window.location.href);
let generated = [];

function inviteUrl(name, side) {
  const url = new URL(baseUrl);
  url.searchParams.set('s', side);
  url.searchParams.set('to', name);
  return url.toString();
}

const inviteMessage = (name, url) => `Dear ${name},\n${config.share.message}\n\nOpen your invitation: ${url}`;

function button(label, onClick) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'btn btn-small';
  el.textContent = label;
  el.addEventListener('click', onClick);
  return el;
}

async function copy(text, el) {
  await navigator.clipboard.writeText(text);
  const original = el.textContent;
  el.textContent = 'Copied!';
  setTimeout(() => (el.textContent = original), 1200);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const side = form.elements.side.value;
  const names = [...new Set(form.elements.names.value.split('\n').map((n) => n.trim()).filter(Boolean))];
  generated = names.map((name) => ({ name, url: inviteUrl(name, side) }));
  output.replaceChildren(
    ...generated.map(({ name, url }) => {
      const item = document.createElement('li');
      const title = document.createElement('strong');
      title.textContent = name;
      const code = document.createElement('code');
      code.textContent = url;
      const row = document.createElement('div');
      row.className = 'row';
      const copyBtn = button('Copy link', () => copy(url, copyBtn));
      row.append(
        copyBtn,
        button('WhatsApp', () =>
          window.open(`https://wa.me/?text=${encodeURIComponent(inviteMessage(name, url))}`, '_blank', 'noopener'),
        ),
        button('Preview', () => window.open(url, '_blank', 'noopener')),
      );
      item.append(title, code, row);
      return item;
    }),
  );
});

const copyAll = document.getElementById('copy-all');
copyAll.addEventListener('click', () => {
  if (!generated.length) return;
  copy(generated.map(({ name, url }) => `${name}: ${url}`).join('\n'), copyAll);
});
