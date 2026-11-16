import './styles.css';
import { config } from './config.js';
import { readGuestName, readSide, shouldSkipCover } from './params.js';
import { startPetals } from './effects/petals.js';
import { burstConfetti } from './effects/confetti.js';
import { mandala, corner, divider, bell, icons, toran } from './art.js';
import { googleCalendarUrl, downloadIcs } from './calendar.js';
import { initMusic, playMusic, pauseMusic, musicWanted } from './music.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const guestName = readGuestName();
const sideKey = readSide();
const side = config.sides[sideKey];
const [first, second] = sideKey === 'bride' ? [config.bride, config.groom] : [config.groom, config.bride];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const personalise = (template, fallback) => (guestName ? template.replace('{name}', guestName) : fallback);
const greeting = personalise(config.guest.greeting, config.guest.fallbackGreeting);
const closing = personalise(config.guest.closing, config.guest.fallbackClosing);
const coupleTitle = `${first.name} weds ${second.name}`;
const formatPhone = (digits) => digits.replace(/^(\d{5})(\d{5})$/, '$1 $2');
const telUrl = (digits) => `tel:+${config.countryCode}${digits}`;
const whatsappUrl = (digits, text) =>
  `https://wa.me/${digits ? config.countryCode + digits : ''}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
const mapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(config.venue.mapQuery)}`;
const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(config.venue.mapQuery)}&output=embed`;

const letters = (word, startMs) =>
  `<span class="name" style="--start:${startMs}ms">${[...word]
    .map((ch, i) => `<span class="ch" style="--i:${i}">${esc(ch)}</span>`)
    .join('')}</span>`;

function coverSection() {
  return `
  <section class="cover" id="cover" aria-label="Invitation cover">
    <div class="cover-mandala">${mandala('mandala cover-mandala-svg')}</div>
    <p class="cover-greeting">${esc(greeting)}</p>
    <p class="cover-sub">You are cordially invited to the wedding of</p>
    <div class="envelope-wrap">
      <div class="envelope" id="envelope">
        <div class="env-back"></div>
        <div class="env-letter">
          <span class="letter-eyebrow">Wedding Invitation</span>
          <span class="letter-names">${esc(first.name)}<em>weds</em>${esc(second.name)}</span>
          <span class="letter-date">${esc(config.wedding.dateLabel)}</span>
        </div>
        <div class="env-front"></div>
        <div class="env-flap"></div>
        <button class="seal" id="seal" type="button" aria-label="Open the invitation">
          <span>${esc(first.name[0])}</span><i>&amp;</i><span>${esc(second.name[0])}</span>
        </button>
      </div>
    </div>
    <p class="cover-hint">Tap the seal to open</p>
  </section>`;
}

function heroSection() {
  return `
  <header class="hero" id="top">
    ${toran(32)}
    <div class="bell bell-left">${bell('bell-grad-l')}</div>
    <div class="bell bell-right">${bell('bell-grad-r')}</div>
    <div class="hero-inner">
      <div class="om" aria-hidden="true">ॐ</div>
      ${config.invocations.map((line, i) => `<p class="invocation" style="--i:${i}">${esc(line)}</p>`).join('')}
      <p class="hero-greeting">${esc(greeting)}</p>
      <div class="hero-stage">
        ${mandala()}
        <h1 class="names" aria-label="${esc(coupleTitle)}">
          ${letters(first.name, 900)}
          <span class="weds">weds</span>
          ${letters(second.name, 1700)}
        </h1>
      </div>
      <p class="hero-date">${esc(config.wedding.dateLabel)}</p>
      <p class="hero-venue">${esc(config.venue.name)}, Bengaluru</p>
      <a class="scroll-cue" href="#invite" aria-label="Scroll to the invitation"><span></span></a>
    </div>
  </header>`;
}

function personBlock(person, line, delay) {
  return `
    <div class="person reveal" style="--delay:${delay}s">
      <p class="person-prefix">${esc(person.prefix)}</p>
      <h3 class="person-name">${esc(person.fullName)}</h3>
      <p class="person-qual">${esc(person.qualification)}</p>
      ${line ? `<p class="person-line">${esc(line)}</p>` : ''}
    </div>`;
}

function inviteSection() {
  const inviteText = `We cordially invite you & your family to grace the auspicious occasion of our ${side.child}'s wedding`;
  return `
  <section class="section invite" id="invite">
    <div class="frame reveal zoom">
      ${['tl', 'tr', 'bl', 'br'].map((pos) => `<span class="corner corner-${pos}">${corner()}</span>`).join('')}
      <p class="frame-greeting reveal">${esc(greeting)}</p>
      <p class="hosts reveal" style="--delay:.1s">${esc(side.hosts)}</p>
      <p class="invite-text reveal" style="--delay:.2s">${esc(inviteText)}</p>
      <div class="reveal" style="--delay:.3s">${divider()}</div>
      ${personBlock(first, first.hostLine, 0.35)}
      <div class="with reveal" style="--delay:.45s"><span>with</span></div>
      ${personBlock(second, second.guestLine, 0.55)}
      <div class="reveal" style="--delay:.6s">${divider()}</div>
      <p class="on-date reveal" style="--delay:.7s">on <strong>${esc(config.wedding.dateLabel)}</strong></p>
    </div>
  </section>`;
}

function countdownSection() {
  const units = ['days', 'hours', 'minutes', 'seconds'];
  return `
  <section class="section countdown" id="countdown">
    <p class="eyebrow reveal">Counting down to the</p>
    <h2 class="title reveal" style="--delay:.1s">Muhurtam</h2>
    <div class="cd" role="timer" aria-live="off">
      ${units
        .map(
          (unit, i) => `
        <div class="cd-unit reveal" style="--delay:${0.15 + i * 0.1}s">
          <span class="cd-num" data-unit="${unit}">--</span>
          <span class="cd-label">${unit}</span>
        </div>`,
        )
        .join('')}
    </div>
    <p class="cd-done" hidden>The auspicious moment is here! ♥</p>
  </section>`;
}

function eventsSection() {
  return `
  <section class="section events" id="events">
    <p class="eyebrow reveal">The Celebrations</p>
    <h2 class="title reveal" style="--delay:.1s">Join Us</h2>
    <div class="timeline">
      <span class="timeline-progress" aria-hidden="true"></span>
      ${config.events
        .map(
          (event, i) => `
        <article class="event reveal slide" style="--delay:${i * 0.12}s">
          <div class="event-icon">${icons[event.icon]()}</div>
          <div class="event-card">
            <h3 class="event-title">${esc(event.title)}</h3>
            <p class="event-sub">${esc(event.subtitle)}</p>
            <ul class="event-meta">
              <li>${icons.calendar()}<span>${esc(event.date)}</span></li>
              <li><span class="meta-time">${esc(event.time)}</span>${event.lagna ? `<span class="lagna">${esc(event.lagna)}</span>` : ''}</li>
            </ul>
            <div class="event-actions">
              <a class="btn btn-small" target="_blank" rel="noopener" data-gcal="${event.id}">${icons.calendar()}Google</a>
              <button class="btn btn-small" type="button" data-ics="${event.id}">${icons.calendar()}Apple / Outlook</button>
            </div>
          </div>
        </article>`,
        )
        .join('')}
    </div>
  </section>`;
}

function venueSection() {
  return `
  <section class="section venue" id="venue">
    <p class="eyebrow reveal">The Venue</p>
    <h2 class="title reveal" style="--delay:.1s">Where to Find Us</h2>
    <div class="venue-card reveal zoom" style="--delay:.15s">
      <div class="venue-pin">${icons.pin()}</div>
      <h3 class="venue-name">${esc(config.venue.name)}</h3>
      <p class="venue-address">${esc(config.venue.address)}</p>
      <div class="map-wrap">
        <iframe title="Map to ${esc(config.venue.name)}" src="${mapsEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <a class="btn btn-solid" href="${mapsDirections}" target="_blank" rel="noopener">${icons.pin()}Get Directions</a>
    </div>
  </section>`;
}

function contactSection() {
  return `
  <section class="section contact" id="contact">
    <p class="eyebrow reveal">For Any Queries</p>
    <h2 class="title reveal" style="--delay:.1s">Reach Us</h2>
    <div class="contacts">
      ${side.phones
        .map(
          (phone, i) => `
        <div class="contact-card reveal" style="--delay:${0.15 + i * 0.1}s">
          <span class="contact-number">${formatPhone(phone)}</span>
          <div class="contact-actions">
            <a class="btn btn-small" href="${telUrl(phone)}">${icons.phone()}Call</a>
            <a class="btn btn-small" href="${whatsappUrl(phone)}" target="_blank" rel="noopener">${icons.chat()}WhatsApp</a>
          </div>
        </div>`,
        )
        .join('')}
    </div>
  </section>`;
}

function closingSection() {
  return `
  <footer class="section closing" id="closing">
    <div class="diyas" aria-hidden="true">${'<span class="diya"></span>'.repeat(5)}</div>
    <p class="closing-text reveal">${esc(closing)}</p>
    <p class="compliments reveal" style="--delay:.1s">${esc(config.compliments)}</p>
    <div class="reveal" style="--delay:.15s">${divider()}</div>
    <div class="from reveal" style="--delay:.2s">
      <p class="eyebrow">From</p>
      <p class="from-hosts">${esc(side.hosts)}</p>
      ${side.address.map((line) => `<p>${esc(line)}</p>`).join('')}
      <p class="from-phones">${side.phones.map((p) => `<a href="${telUrl(p)}">${formatPhone(p)}</a>`).join(' / ')}</p>
    </div>
    <button class="btn btn-solid share-btn reveal" style="--delay:.3s" type="button" id="share">${icons.share()}Share the Invitation</button>
    <p class="signature">${esc(first.name)} <span class="heart">${icons.heart()}</span> ${esc(second.name)}<br /><small>${esc(config.wedding.shortDate)}</small></p>
  </footer>`;
}

function render() {
  document.title = guestName ? `${guestName}, you're invited · ${coupleTitle}` : `${coupleTitle} · Wedding Invitation`;
  $('#app').innerHTML = `
    <canvas id="petals" aria-hidden="true"></canvas>
    ${shouldSkipCover() ? '' : coverSection()}
    <main class="main">
      ${heroSection()}
      ${inviteSection()}
      ${countdownSection()}
      ${eventsSection()}
      ${venueSection()}
      ${contactSection()}
      ${closingSection()}
    </main>
    <button class="music-btn" id="music" type="button" aria-label="Play music" aria-pressed="false" hidden>
      ${icons.music()}<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    </button>`;
}

function setupCover(petals) {
  const cover = $('#cover');
  if (!cover) {
    document.body.classList.add('opened');
    return;
  }
  document.body.classList.add('locked');
  const envelope = $('#envelope');
  let opening = false;

  async function open() {
    if (opening) return;
    opening = true;
    playMusic();
    const step = reducedMotion ? 0.2 : 1;
    envelope.classList.add('is-opening');
    await wait(350 * step);
    envelope.classList.add('flap-open');
    await wait(450 * step);
    envelope.classList.add('flap-behind');
    await wait(250 * step);
    envelope.classList.add('letter-out');
    await wait(1100 * step);
    cover.classList.add('is-leaving');
    document.body.classList.remove('locked');
    document.body.classList.add('opened');
    window.scrollTo(0, 0);
    petals?.burst(45);
    const { innerWidth: w, innerHeight: h } = window;
    burstConfetti(0, h * 0.9, { angle: -Math.PI / 3, spread: 0.8, power: 18, count: 90 });
    burstConfetti(w, h * 0.9, { angle: (-2 * Math.PI) / 3, spread: 0.8, power: 18, count: 90 });
    await wait(1000);
    cover.remove();
  }

  $('#seal').addEventListener('click', open);
  envelope.addEventListener('click', open);
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );
  $$('.reveal').forEach((el) => observer.observe(el));
}

function setupCountdown() {
  const target = new Date(config.wedding.muhurtamISO).getTime();
  const nums = Object.fromEntries($$('.cd-num').map((el) => [el.dataset.unit, el]));
  const done = $('.cd-done');
  let timer = 0;

  function update() {
    const diff = Math.max(0, target - Date.now());
    const values = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff / 3600000) % 24,
      minutes: Math.floor(diff / 60000) % 60,
      seconds: Math.floor(diff / 1000) % 60,
    };
    for (const [unit, el] of Object.entries(nums)) {
      const text = String(values[unit]).padStart(2, '0');
      if (el.textContent === text) continue;
      el.textContent = text;
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
    if (diff === 0) {
      done.hidden = false;
      clearInterval(timer);
    }
  }
  update();
  timer = setInterval(update, 1000);
}

function setupEvents() {
  const location = `${config.venue.name}, ${config.venue.address}`;
  const details = `${coupleTitle}\n${config.wedding.dateLabel}\nVenue: ${location}\nDirections: ${mapsDirections}`;
  const calendarEvent = (id) => {
    const event = config.events.find((e) => e.id === id);
    return { ...event, title: `${event.title} · ${first.name} & ${second.name}`, details, location };
  };
  $$('[data-gcal]').forEach((link) => {
    link.href = googleCalendarUrl(calendarEvent(link.dataset.gcal));
  });
  $$('[data-ics]').forEach((button) => {
    button.addEventListener('click', () => downloadIcs(calendarEvent(button.dataset.ics)));
  });

  const timeline = $('.timeline');
  const progress = $('.timeline-progress');
  let queued = false;
  const paint = () => {
    queued = false;
    const rect = timeline.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - rect.top) / rect.height));
    progress.style.setProperty('--p', p.toFixed(3));
  };
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    },
    { passive: true },
  );
  paint();
}

function setupShare() {
  $('#share').addEventListener('click', async () => {
    const url = new URL(window.location.href);
    config.guest.params.forEach((param) => url.searchParams.delete(param));
    url.hash = '';
    const text = config.share.message;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${coupleTitle} · Wedding Invitation`, text, url: url.toString() });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    window.open(whatsappUrl('', `${text}\n${url}`), '_blank', 'noopener');
  });
}

function setupMusic() {
  const button = $('#music');
  const enabled = initMusic(config.music, {
    onStateChange(playing) {
      button.classList.toggle('is-playing', playing);
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    },
  });
  if (!enabled) return;
  button.hidden = false;

  let touched = false;
  button.addEventListener('click', () => {
    touched = true;
    if (musicWanted()) pauseMusic();
    else playMusic();
  });

  if (!$('#cover')) {
    document.addEventListener(
      'pointerdown',
      (event) => {
        if (!touched && !event.target.closest('#music')) playMusic();
      },
      { once: true },
    );
  }
}

function setupSparkles() {
  if (reducedMotion) return;
  document.addEventListener('pointerdown', (event) => {
    if (!document.body.classList.contains('opened')) return;
    if (event.target.closest('input, textarea, button, a, select, canvas, iframe, label')) return;
    for (let i = 0; i < 10; i++) {
      const spark = document.createElement('span');
      const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
      const distance = 30 + Math.random() * 40;
      spark.className = 'spark';
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      spark.addEventListener('animationend', () => spark.remove());
      document.body.append(spark);
    }
  });
}

render();
const petals = reducedMotion ? null : startPetals($('#petals'));
setupCover(petals);
setupReveal();
setupCountdown();
setupEvents();
setupShare();
setupMusic();
setupSparkles();
