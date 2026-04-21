const bootLogs = [
  "> INITIALIZING HARNOOR.OS v2.0.25...",
  "> LOADING QUANTUM SUBSYSTEMS...",
  "> SCANNING NETWORK TOPOLOGY...",
  "> CRYPTOGRAPHIC KEYS VERIFIED.",
  "> EMBEDDED CONTROLLERS ONLINE.",
  "> THREAT ASSESSMENT: NOMINAL.",
  "> IDENTITY MATRIX LOADED.",
  "> SYSTEM READY.",
];

const logEl = document.getElementById('boot-log');
const fillEl = document.getElementById('boot-fill');
const bootScreen = document.getElementById('boot-screen');
const body = document.body;

let logIndex = 0;
let charIndex = 0;
let currentLine = '';
let lineEl = null;

function typeChar() {
  const log = bootLogs[logIndex];
  if (charIndex === 0) {
    lineEl = document.createElement('div');
    logEl.appendChild(lineEl);
  }
  if (charIndex < log.length) {
    currentLine += log[charIndex];
    lineEl.textContent = currentLine;
    charIndex++;
    const pct = ((logIndex / bootLogs.length) + (charIndex / log.length / bootLogs.length)) * 100;
    fillEl.style.width = pct + '%';
    setTimeout(typeChar, Math.random() * 30 + 10);
  } else {
    logIndex++;
    charIndex = 0;
    currentLine = '';
    if (logIndex < bootLogs.length) {
      setTimeout(typeChar, 120);
    } else {
      fillEl.style.width = '100%';
      setTimeout(() => {
        bootScreen.classList.add('done');
        body.classList.remove('booting');
      }, 500);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeChar, 400);
});
