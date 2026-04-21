# Hrishikesh Harnoor — HUD Portfolio

JARVIS-style sci-fi HUD portfolio. Zero dependencies, pure HTML/CSS/JS.

## Features

- Boot sequence animation
- Interactive particle + hex grid canvas (mouse-reactive)
- Hologram photo frame with scanlines, glitch, duotone
- Rotating radar rings + sweep
- Glitch text effect
- Typewriter cycling taglines
- Live HUD clock + mouse coordinates
- Data stream sidebar
- Scroll-triggered animations
- All subpages: About, Projects, Skills, Contact

## Structure

```
hud-portfolio/
├── index.html
├── css/
│   ├── hud.css        # Core HUD styles
│   ├── glitch.css     # Glitch effects
│   └── subpage.css    # Subpage styles
├── js/
│   ├── boot.js        # Boot sequence
│   ├── canvas.js      # Particle canvas
│   └── hud.js         # Interactions
└── pages/
    ├── about.html
    ├── projects.html
    ├── skills.html
    └── contact.html
```

## Adding Your Photo

In `index.html`, find `.photo-placeholder` and replace with:
```html
<img src="assets/photo.jpg" alt="Hrishikesh Harnoor"/>
```
Place your image in the `assets/` folder. The hologram effects apply automatically.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "init: HUD portfolio"
git remote add origin https://github.com/Hrishikesh122/<repo>.git
git push -u origin main
```
Settings → Pages → Source: main branch → `/` root

## Customization

- Colors: edit CSS variables in `:root` inside `hud.css`
- Taglines: edit `phrases` array in `hud.js`
- Projects/skills: edit HTML directly in the respective pages
- Update your real email in `pages/contact.html`

---

© 2025 Hrishikesh Harnoor
