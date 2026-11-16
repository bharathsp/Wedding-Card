const COLORS = ['#c8344a', '#e4798b', '#f2c6cf', '#f28c28', '#ffc93c', '#fff4e0'];
const TAU = Math.PI * 2;

export function startPetals(canvas, { density = 1 } = {}) {
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let petals = [];
  let last = performance.now();
  let raf = 0;

  const targetCount = () => Math.round(Math.min(60, Math.max(18, (width * height) / 26000)) * density);

  function spawn(anywhere, extra = false) {
    return {
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -20 - Math.random() * 60,
      size: 5 + Math.random() * 7,
      vy: 0.35 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.3,
      swayAmp: 0.4 + Math.random() * 1.1,
      swaySpeed: 0.01 + Math.random() * 0.02,
      phase: Math.random() * TAU,
      rot: Math.random() * TAU,
      vr: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * TAU,
      vf: 0.02 + Math.random() * 0.04,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.6 + Math.random() * 0.35,
      extra,
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    while (petals.filter((p) => !p.extra).length < targetCount()) petals.push(spawn(true));
  }

  function draw(p) {
    const s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(0.35 + 0.65 * Math.abs(Math.cos(p.flip)), 1);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.55, s * 0.6, s * 0.8, 0, s);
    ctx.bezierCurveTo(-s * 0.6, s * 0.8, -s * 0.95, -s * 0.55, 0, -s);
    ctx.fill();
    ctx.globalAlpha = p.alpha * 0.35;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.7);
    ctx.lineTo(0, s * 0.7);
    ctx.stroke();
    ctx.restore();
  }

  function frame(now) {
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    ctx.clearRect(0, 0, width, height);
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.phase += p.swaySpeed * dt;
      p.x += (p.vx + Math.sin(p.phase) * p.swayAmp) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.flip += p.vf * dt;
      if (p.y > height + 20 || p.x < -40 || p.x > width + 40) {
        if (p.extra) {
          petals.splice(i, 1);
          continue;
        }
        Object.assign(p, spawn(false));
      }
      draw(p);
    }
    raf = requestAnimationFrame(frame);
  }

  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });
  window.addEventListener('resize', resize);
  resize();
  raf = requestAnimationFrame(frame);

  return {
    burst(count = 40) {
      for (let i = 0; i < count; i++) {
        const p = spawn(false, true);
        p.y = -10 - Math.random() * height * 0.5;
        p.vy *= 1.8;
        petals.push(p);
      }
    },
  };
}
