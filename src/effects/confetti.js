const COLORS = ['#f6dfa0', '#e9c46a', '#d4a24c', '#d6556b', '#fff8ec', '#f28c28'];

let canvas;
let ctx;
let particles = [];
let running = false;
let last = 0;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
}

function tick(now) {
  const dt = Math.min((now - last) / 16.67, 3);
  last = now;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);

  for (const p of particles) {
    p.vx *= 0.985;
    p.vy = p.vy * 0.985 + 0.22 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    p.tilt += 0.12 * dt;
    p.life -= p.decay * dt;

    ctx.save();
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.round) {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.scale(1, Math.cos(p.tilt));
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    ctx.restore();
  }

  if (particles.length) {
    requestAnimationFrame(tick);
  } else {
    running = false;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

export function burstConfetti(x, y, { count = 120, angle = -Math.PI / 2, spread = Math.PI * 2, power = 9 } = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ensureCanvas();
  for (let i = 0; i < count; i++) {
    const a = angle + (Math.random() - 0.5) * spread;
    const v = power * (0.4 + Math.random() * 0.8);
    particles.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      size: 5 + Math.random() * 6,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.3,
      tilt: Math.random() * 6,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      round: Math.random() < 0.3,
      life: 1,
      decay: 0.006 + Math.random() * 0.008,
    });
  }
  if (!running) {
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  }
}
