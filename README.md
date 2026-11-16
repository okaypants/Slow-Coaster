# Slow Coaster

A slow, chunky-pixel drifting game for phones. Drag anywhere to steer the little white dot, collect the ringed pips, and keep clear of the shapes. Everything you do adds notes to a tune the game writes as you go, and it keeps the tune, your best score and your current run between visits.

The whole game is one file, `index.html`: no build step and no dependencies. Sound is synthesised in the browser. The only thing loaded from outside is the Fredoka font from Google Fonts.

## Controls

- **Touch:** tap to start, then drag anywhere to move. Tap the pause button to return to the title screen; your run is kept.
- **Mouse / keyboard:** click, Space or Enter to start; move the mouse to steer.
- **Title screen:** the blue button plays back your tune, the pink button wipes it (tap twice).

## Run it locally

Opening `index.html` straight from disk works for a quick look. To get the installable, offline version, serve the folder over HTTP, because service workers do not run from `file://`:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Put it on GitHub Pages

1. On GitHub, open this repository's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then **Save**.
4. After a minute or so the game is live at `https://<your-username>.github.io/Slow-Coaster/`.

Every push to `main` redeploys it.

## Install to the home screen

- **iPhone / iPad (Safari):** Share → **Add to Home Screen**.
- **Android (Chrome):** menu → **Install app** or **Add to Home screen**.

Once it has been opened online one time, it also works offline.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The game |
| `manifest.webmanifest` | Name, colours and icons for home-screen install |
| `sw.js` | Small service worker that caches the game and its font for offline play |
| `icon-*.png`, `apple-touch-icon.png` | Home-screen icons |

The service worker fetches from the network first and falls back to its cache, so updates appear on the next online visit. If you change the list of cached files, bump the `CACHE` name in `sw.js`.
