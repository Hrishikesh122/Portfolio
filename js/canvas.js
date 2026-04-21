const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], lines = [];
  const mouse = { x: -9999, y: -9999 };
  const ACCENT = '0,212,255';
  const ACCENT2 = '0,255,159';

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 12000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.7 ? ACCENT2 : ACCENT,
      });
    }
  }

  function drawGrid() {
    const spacing = 60;
    ctx.strokeStyle = `rgba(${ACCENT},0.04)`;
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function drawParticles() {
    for (const p of particles) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repel = Math.max(0, 1 - dist / 160);
      p.x += p.vx + (dx / (dist + 1)) * repel * 0.5;
      p.y += p.vy + (dy / (dist + 1)) * repel * 0.5;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      const hoverAlpha = p.alpha + repel * 0.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + repel * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${Math.min(hoverAlpha, 0.9)})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.15;
          ctx.strokeStyle = `rgba(${ACCENT},${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawHexGrid() {
    const size = 40, cols = Math.ceil(W / (size * 1.5)) + 1;
    const rows = Math.ceil(H / (size * Math.sqrt(3))) + 1;
    ctx.strokeStyle = `rgba(${ACCENT},0.025)`;
    ctx.lineWidth = 0.5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * size * 1.5;
        const y = r * size * Math.sqrt(3) + (c % 2 ? size * Math.sqrt(3) / 2 : 0);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = Math.PI / 180 * (60 * i - 30);
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // Mouse-reactive scanline
  let scanY = 0;
  function drawScanline() {
    scanY = (scanY + 0.5) % H;
    const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, `rgba(${ACCENT},0.03)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 20, W, 40);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawHexGrid();
    drawScanline();
    drawConnections();
    drawParticles();
    requestAnimationFrame(loop);
  }

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('resize', resize);
  resize();
  loop();
}
