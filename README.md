# HTML Product Photo Frame Tool

[English](./README.md) | [繁體中文](./README_zh_tw.md)

A browser-based tool for composing product photos by placing a background image under a frame/watermark overlay, then exporting the merged result as PNG.

## Demo

- [Live Demo](https://pulipulichen.github.io/HTML-Product-Photo-Frame-Tool/)

## Features

- Overlay workflow: set a top-layer image by URL (frame/watermark) and upload a bottom-layer image by drag-and-drop or file picker.
- Bottom image URL input: paste an image URL directly as the base photo source.
- Canvas controls: drag directly on the canvas to move the bottom image.
- Fit modes: `autoShort`, `width`, and `height`.
- Bottom image scale slider: adjustable from 10% to 300%.
- Built-in quick frame button: apply the bundled `assets/frame.png` frame in one click.
- PNG export: download merged image with a timestamped filename.
- Session persistence: top URL, bottom image (Data URL), fit mode, and scale are stored in `localStorage`.
- Query-parameter image loading: preload frame/photo via `?frame=<url>&photo=<url>`.
- Fated Finds resolver support: with `?fated_finds=true`, `photo` is resolved through a remote resolver and injected as Data URL.
- Bilingual UI: runtime language switch between Traditional Chinese and English.
- PWA-ready shell: includes `manifest.json` and a service worker for app shell caching.

## URL Parameters

- `frame`: prefill top-layer frame image URL.
- `photo`: prefill bottom-layer image URL.
- `fated_finds=true`: treat `photo` as a Fated Finds identifier and resolve image data via remote API.

Example:

```text
https://pulipulichen.github.io/HTML-Product-Photo-Frame-Tool/?frame=https://example.com/frame.png&photo=https://example.com/photo.jpg
```

## Project Structure

- `index.html`: UI layout and app entry.
- `scripts/main.js`: app bootstrap, events, state wiring, service worker registration.
- `scripts/core.js`: canvas rendering logic.
- `scripts/ui.js`: drag-drop upload and pointer drag behavior.
- `scripts/services.js`: `localStorage` persistence helpers.
- `scripts/utils.js`: utility functions (filename, validation, scale parsing).
- `service-worker.js`: app shell cache strategy.
- `e2e/`: Playwright end-to-end test cases.

## Run Locally

This is a static frontend project. You can serve it with any static server.

Example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## E2E Testing (Podman Compose)

Playwright tests run inside a Podman Compose workflow defined by `compose.yml` and `Containerfile.test`.

```bash
npm run start
```

or

```bash
npm run e2e
```

Test artifacts are generated in:

- `playwright-report/`
- `playwright-report-videos/`
