# 3D Art Gallery

A walkable, first-person virtual art gallery built with [Three.js](https://threejs.org/) and TypeScript. Wander through a room hung with world-famous paintings — Van Gogh, da Vinci, Vermeer, Hokusai, Monet and more — and look at any piece to read its title, artist and story.

**Live demo:** https://ilaydaozel.github.io/3D-Art-Gallery/

## Features

- First-person walkthrough with mouse-look and WASD/arrow-key movement (mobile falls back to on-screen touch controls)
- Framed paintings hung automatically around the room, wrapping into extra rows as more artworks are added
- An artwork info card that appears when you look directly at a painting, showing its title, artist and description
- A window with daylight streaming into the room, and warm gallery track lighting
- A loading screen with a progress bar so the gallery only opens once every painting has actually loaded

## Tech stack

- [Three.js](https://threejs.org/) for the 3D scene, lighting and controls
- TypeScript
- [Vite](https://vitejs.dev/) for development and bundling
- [gh-pages](https://www.npmjs.com/package/gh-pages) for deployment to GitHub Pages

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (comes with Node.js)

### Clone the repository

```
git clone https://github.com/ilaydaozel/3D-Art-Gallery.git
cd 3D-Art-Gallery
```

### Install dependencies

```
npm install
```

### Run it locally

```
npm run dev
```

This starts the Vite dev server (with hot reload) and prints a local URL — open it in your browser, click **Enter the Gallery**, and walk around.

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the local development server |
| `npm run build` | Type-checks the project and builds a production bundle into `dist/` |
| `npm run preview` | Serves the production build from `dist/` locally, to sanity-check it before deploying |
| `npm run deploy` | Publishes the current `dist/` folder to the `gh-pages` branch so it goes live on GitHub Pages — run `npm run build` first |

## Deploying

The live site is published from the `gh-pages` branch of this repo via GitHub Pages. To ship a new version after making changes:

```
npm run build
npm run deploy
```

`npm run build` compiles the TypeScript and produces an optimized `dist/` folder; `npm run deploy` pushes that folder to the `gh-pages` branch, which GitHub Pages serves at the live demo URL above (usually within a minute or two).

## Adding or editing artwork

The gallery's paintings are defined in [`src/data/artworks.ts`](src/data/artworks.ts) — each entry needs a title, artist, year, medium, `width`/`height` (used to size the canvas on the wall) and an image `url`. Add a new object to the array to hang another painting; the layout algorithm in [`src/components/Painting.ts`](src/components/Painting.ts) automatically places it on a wall and wraps into a new row if the walls are full.

## Project structure

```
src/
  components/
    Room.ts       # floor, ceiling, walls, baseboards, the window
    Window.ts     # window glass, frame and mullions
    Painting.ts   # painting/frame meshes and the wall-hanging layout
    Light.ts      # ambient/hemisphere light and ceiling track lighting
    Controls.ts   # pointer-lock (desktop) and touch (mobile) movement
    BoundingBox.ts# simple collision so you can't walk through walls
  data/
    artworks.ts   # the list of paintings shown in the gallery
  main.ts         # wires the scene together, loading screen, artwork info panel
```
