export function createScratch(container, { label = 'Scratch', threshold = 0.45, onReveal } = {}) {
  const canvas = document.createElement('canvas');
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'button');
  canvas.setAttribute('aria-label', 'Scratch to reveal (or press Enter)');
  container.append(canvas);

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let revealed = false;
  let drawing = false;
  let strokes = 0;
  let last = null;

  function paint() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    const foil = ctx.createLinearGradient(0, 0, w, h);
    foil.addColorStop(0, '#8a5f22');
    foil.addColorStop(0.25, '#e9c46a');
    foil.addColorStop(0.5, '#fff1c1');
    foil.addColorStop(0.75, '#d4a24c');
    foil.addColorStop(1, '#8a5f22');
    ctx.fillStyle = foil;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < (w * h) / 30; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.25})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }

    ctx.fillStyle = 'rgba(90,16,36,0.78)';
    ctx.font = `600 ${Math.max(10, w * 0.11)}px Cinzel, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, h / 2);
  }

  function check() {
    if (revealed) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] === 0) clear++;
    }
    if (clear / total >= threshold) reveal();
  }

  function scratch(from, to) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = container.clientWidth * 0.22;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    if (++strokes % 10 === 0) check();
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    canvas.classList.add('is-gone');
    onReveal?.();
    setTimeout(() => canvas.remove(), 700);
  }

  canvas.addEventListener('pointerdown', (event) => {
    if (revealed) return;
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    last = point(event);
    scratch(last, { x: last.x + 0.1, y: last.y });
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!drawing) return;
    const next = point(event);
    scratch(last, next);
    last = next;
  });
  const stop = () => {
    if (!drawing) return;
    drawing = false;
    check();
  };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);
  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      reveal();
    }
  });

  paint();
  document.fonts?.ready.then(() => {
    if (!strokes && !revealed) paint();
  });
  new ResizeObserver(() => {
    if (!strokes && !revealed) paint();
  }).observe(container);

  return { reveal };
}
