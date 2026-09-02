# Hrishikesh Harnoor - Portfolio

Personal portfolio. Static HTML, CSS and JavaScript with no build step and no
dependencies, deployed on GitHub Pages.

Live at <https://hrishikesh122.github.io/Portfolio/>

## Structure

```
.
├── index.html            Home: hero, selected work, research, contact band
├── 404.html
├── robots.txt
├── sitemap.xml
├── .nojekyll             Stops GitHub Pages running Jekyll over the files
├── assets/
│   ├── photo.jpeg
│   ├── favicon.svg
│   └── og.png            1200x630 social preview card
├── css/
│   ├── core.css          Tokens, reset, navigation, buttons, footer, motion
│   └── pages.css         Page and section specific styles
├── js/
│   ├── site.js           Mobile navigation, scroll reveal, boot sequence
│   ├── field.js          Hero particle canvas (home only)
│   └── contact.js        Contact form validation and submission
└── pages/
    ├── about.html
    ├── projects.html
    ├── skills.html
    └── contact.html
```

## Contact form

The form does not send anything until a Formspree form is connected. Until
then it opens a prefilled email in the visitor's mail client and says so. It
never fakes a successful send.

To connect it:

1. Create a form at <https://formspree.io> using `harnoorhrishikesh@gmail.com`.
2. Formspree gives you an endpoint like `https://formspree.io/f/mabcdefg`.
3. Open `js/contact.js` and set `FORM_ID` to the last part of that URL.

```js
var FORM_ID = 'mabcdefg';
```

Commit and push. The form posts straight to Formspree from the browser, with a
honeypot field for naive bots and a fallback message if the request fails.

## Project links

Every "View code" link on `pages/projects.html` currently points at the GitHub
profile. Replace each `href` with the individual repository URL as those repos
go public. They are marked with a comment at the top of the projects grid.

## Design notes

- One locked dark theme, one accent colour, one corner radius (sharp).
- Type is Space Grotesk for headings and body, JetBrains Mono for HUD chrome.
- All text colours pass WCAG AA contrast against the background.
- Every animation is behind `prefers-reduced-motion`, including the canvas.
- The canvas pauses when scrolled out of view and in background tabs, and
  renders at device pixel ratio.
- The boot sequence runs once per browser session, is capped at about one
  second, can be dismissed with a click or any key, and is skipped entirely
  under reduced motion.
- No skill percentages, no fake status readouts, no fabricated metrics.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy

GitHub Pages serves the `main` branch from the repository root. Pushing to
`main` publishes; the update is usually live within a minute.
