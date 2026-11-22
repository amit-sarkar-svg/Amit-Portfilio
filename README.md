# Amit Sarkar | Developer Portfolio

A cinematic, animation driven portfolio for a backend and systems engineer. A full screen 3D hero that you scroll through, an animated background, live charts for project results, and a handful of hidden surprises. Built with React, Vite, Tailwind CSS, anime.js and three.js.

---

## Table of contents

- [Highlights](#highlights)
- [Hidden surprises](#hidden-surprises)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Customizing the content](#customizing-the-content)
- [Design notes](#design-notes)
- [Accessibility and performance](#accessibility-and-performance)
- [Credits](#credits)
- [Contact](#contact)

---

## Highlights

- **Scroll driven hero.** A pinned full screen stage. The 3D data core is fully visible on arrival; scrolling flies the camera into it, the headline lifts away and the tagline lights up word by word before the page continues.
- **Living background.** Colour fields that drift and move at different speeds as you scroll, a dot grid with a rolling ripple that answers the cursor, twinkling particles, shooting stars and a soft light that follows the pointer.
- **Impact charts.** Project results shown with [Bklit UI](https://ui.bklit.com) bar and ring charts.
- **Stacked project cards.** Each project slides over the previous one, which shrinks and dims.
- **Cinematic navigation.** Grouped glass pills with a sliding highlight, plus a Ctrl or Cmd + K command palette to jump to any section or open a link.
- **Playful controls.** A goo button that reaches for your cursor, a copy button, a button that dodges the cursor and then gives up, tilting cards, magnifying skill chips and an outlined marquee that leans with scroll speed.
- **Responsive and keyboard friendly.** Checked at phone width, with a skip link, visible focus rings and a custom 404 page.

---

## Hidden surprises

- **Click sparks.** Click empty space for a ring and a burst of colour.
- **Konami code.** Up, up, down, down, left, right, left, right, B, A for confetti.
- **Type `hire`.** Anywhere on the page, outside a text field.
- **Drag me.** A badge in the hero that you can throw around. It keeps its momentum.
- **Text scramble.** Hover your name in the nav or a project title.
- **Console message.** Open the browser console.

---

## Tech stack

| Tech | Used for |
|------|----------|
| React 19 | UI |
| Vite 6 | Dev server and build |
| Tailwind CSS 4 | Styling and the design tokens |
| [anime.js 4](https://animejs.com) | Almost all motion: hero entrance, scroll effects, ripple, buttons, palette |
| three.js and React Three Fiber | The 3D data core in the hero |
| [Bklit UI](https://ui.bklit.com) | Bar and ring charts (installed as source with the shadcn CLI) |
| Phosphor Icons | Icons |
| Motion | Required by the Bklit chart components |

---

## Project structure

```bash
├── public/
│   ├── assets/             # Logos, social icons and images
│   ├── favicon.svg
│   └── og.svg              # Social sharing image
├── src/
│   ├── components/         # Reusable pieces (Background, HeroScene, GooButton, ...)
│   │   └── charts/         # Bklit UI chart components
│   ├── constants/          # All site content in one file (index.js)
│   ├── hooks/              # Motion helpers (reduced motion, scroll idle, stagger)
│   ├── lib/                # Utilities used by the charts
│   ├── sections/           # Page sections (Hero, Work, Impact, Skills, ...)
│   ├── App.jsx             # Page layout
│   ├── index.css           # Design tokens and named text styles
│   └── main.jsx            # Entry point
├── components.json        # shadcn and Bklit registry config
├── index.html
├── tsconfig.json          # Path alias for the chart components
└── vite.config.js
```

---

## Getting started

1. Clone the repository

```bash
git clone https://github.com/amit-sarkar-svg/Amit-Portfilio.git
cd Amit-Portfilio
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

The app will be available at http://localhost:5173.

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

---

## Customizing the content

Nearly everything on the page comes from [`src/constants/index.js`](src/constants/index.js): your profile links, stats, tagline, projects, process steps, skills, FAQ and chart data.

- **Add an email button.** Set `email` in `profile`. An "Email me" button appears in the contact section once it has a value.
- **Add a project.** Add an entry to `projects` with a title, summary, bullet points, tags and an optional `href`.
- **Change chart numbers.** Edit `impact`. Only use figures from your real results.
- **Change colours.** The tokens live at the top of [`src/index.css`](src/index.css).

The site has no contact form. It links to LinkedIn, GitHub and Instagram instead.

---

## Design notes

- **Type.** Geist, with Geist Mono for data labels. Every piece of text uses a named style such as `heading-1`, `body-3` or `caption-2`, defined once in `index.css`.
- **Surfaces.** Flat dark backgrounds from a fixed palette, with a violet and cyan accent. The background glows and a few decorative edges use soft gradients on purpose.
- **Motion.** Eased with one shared curve, `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Inspiration.** Layout and interaction ideas came from GetLayers, OriginKit, useLayouts and Evil Buttons. Everything was rebuilt from scratch with anime.js.

---

## Accessibility and performance

- All motion respects `prefers-reduced-motion`. The hero stops pinning, effects switch to still frames and the tagline shows as plain text.
- The 3D scene and the charts load as separate chunks, so they do not delay the first paint.
- The 3D scene only renders while the hero is on screen.
- Heavy background loops pause while you scroll and resume when you stop.
- Fine pointer effects (cursor ring, goo button, tilt, drag badge) are skipped on touch screens.

---

## Credits

- [anime.js](https://animejs.com) for the animation engine.
- [Bklit UI](https://ui.bklit.com) (MIT) for the chart components.
- [Phosphor Icons](https://phosphoricons.com) for icons.
- Interaction ideas from [GetLayers](https://www.getlayers.ai), [OriginKit](https://www.originkit.dev), [useLayouts](https://uselayouts.com) and [Evil Buttons](https://evilbuttons.com).

---

## Contact

- LinkedIn: https://www.linkedin.com/in/amit-sarkar-4baa5b320/
- GitHub: https://github.com/amit-sarkar-svg
- Instagram: https://www.instagram.com/amit_._sarkar/

If you like this project, a star on the repository is always appreciated. Suggestions and feedback are welcome through an issue or a pull request.
