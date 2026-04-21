// Clock
function updateClock() {
  const el = document.getElementById('hud-clock');
  if (!el) return;
  const now = new Date();
  el.textContent = [
    now.getHours().toString().padStart(2,'0'),
    now.getMinutes().toString().padStart(2,'0'),
    now.getSeconds().toString().padStart(2,'0')
  ].join(':');
}
setInterval(updateClock, 1000);
updateClock();

// Mouse coordinates display
document.addEventListener('mousemove', e => {
  const cx = document.getElementById('coord-x');
  const cy = document.getElementById('coord-y');
  if (cx) cx.textContent = `X: ${e.clientX.toString().padStart(4,'0')}`;
  if (cy) cy.textContent = `Y: ${e.clientY.toString().padStart(4,'0')}`;
});

// Typewriter
const phrases = [
  'BRIDGING THE QUANTUM FRONTIER WITH CODE.',
  'SECURING SYSTEMS FROM SILICON TO CYBERSPACE.',
  'BUILDING INTELLIGENCE AT THE EDGE.',
  'WHERE HARDWARE MEETS THE FUTURE.',
];
let phraseIdx = 0, charIdx2 = 0, deleting = false;

function typeWriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    el.textContent = phrase.slice(0, charIdx2 + 1) + '▮';
    charIdx2++;
    if (charIdx2 === phrase.length) {
      deleting = true;
      setTimeout(typeWriter, 2000);
      return;
    }
  } else {
    el.textContent = phrase.slice(0, charIdx2 - 1) + '▮';
    charIdx2--;
    if (charIdx2 === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, deleting ? 40 : 55);
}
setTimeout(typeWriter, 3000);

// Data stream sidebar
const streamChars = '01アイウエオカキクケコアBCDEF0110QUANTUM';
const streamEl = document.createElement('div');
streamEl.className = 'data-stream';
for (let i = 0; i < 20; i++) {
  const c = document.createElement('div');
  c.className = 'data-stream-char';
  c.style.setProperty('--i', i);
  c.textContent = streamChars[Math.floor(Math.random() * streamChars.length)];
  setInterval(() => {
    c.textContent = streamChars[Math.floor(Math.random() * streamChars.length)];
  }, 300 + Math.random() * 500);
  streamEl.appendChild(c);
}
document.body.appendChild(streamEl);

// Intersection observer for fade-ins
document.querySelectorAll('.feat-card, .stat-row, .gauge-row, .proj-item').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(10px)';
  el.style.transition = `opacity 0.5s ease ${i*0.06}s, transform 0.5s ease ${i*0.06}s`;
});

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'none';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feat-card, .stat-row, .gauge-row, .proj-item').forEach(el => io.observe(el));
const glow = document.getElementById("cursor-glow");

document.addEventListener("mousemove", (e) => {
  if (glow) {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }
});