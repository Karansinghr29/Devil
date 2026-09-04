# A Birthday Surprise 🎈❤️∞

A one-page, mobile-first romantic birthday experience.
No build step, no dependencies, no backend — plain HTML, CSS and JavaScript.
Drop it on GitHub Pages (or Netlify / Vercel / Cloudflare Pages) and send her the link.

```
birthday-surprise/
├── index.html      structure
├── style.css       all the visual design
├── script.js       animations, balloons, player   (you never need to edit this)
├── config.js       ⭐ EVERYTHING PERSONAL LIVES HERE
├── README.md
└── assets/
    ├── photo1.jpg … photo5.jpg
    ├── song.mp3
    └── artwork.jpg   (optional)
```

---

## The story flow

🎈 balloons → ❤️ *Happy Birthday, My Life* → 📸 our memories → ❤️ the things I never said →
💌 Tamil poem → 🎵 the song that says it for me → 💌 my letter → ❤️∞ the last words

---

## 1. Installing dependencies

None. There is nothing to install.

## 2. Running locally

Easiest: **double-click `index.html`.** It works straight from the file system.

For a proper test (and to open it from your phone), run a tiny local server:

```bash
python -m http.server 8080
```

or, if you have Node:

```bash
npx serve .
```

Then open `http://localhost:8080`.

## 3. Testing it in mobile view

**In the browser (fastest)**

1. Open `http://localhost:8080` in Chrome or Edge
2. Press `F12`, then `Ctrl` + `Shift` + `M` to toggle the device toolbar
3. Pick **iPhone 14 Pro** or **Pixel 7**, set the zoom to 100 %, and reload

**On your real phone (do this at least once)**

1. Make sure the phone is on the same Wi-Fi as your computer
2. Find your computer's local IP:

```bash
ipconfig
```

   Look for `IPv4 Address` — something like `192.168.1.7`
3. Keep the server from step 2 running, and on your phone open:
   `http://192.168.1.7:8080`

That is exactly what she will see.

## 4. Replacing the photos

1. Copy your images into `assets/` and name them `photo1.jpg` … `photo5.jpg`
2. Refresh. That's it.

Want different filenames, more photos or fewer? Open `config.js` → `memories.photos`:

```js
photos: [
  { src: "assets/beach.jpg", caption: "The day everything felt lighter." },
  { src: "assets/photo2.jpg", caption: "You laughing — my favourite sound." }
]
```

Portrait images look best on a phone. Anything wider than ~1600 px is worth resizing —
it keeps the page fast on mobile data. Until a real file exists, a soft placeholder is
shown automatically, so the page never looks broken.

## 5. Adding the song

Put your legally obtained audio file in `assets/` and name it `song.mp3`.
Different name or format? `config.js` → `song.file`.

```js
song: {
  title: "Asku Laska",
  subtitle: "Nanban (2012)",
  credit: "Music: Harris Jayaraj",
  file: "assets/song.mp3",
  artwork: "",                 // e.g. "assets/artwork.jpg"
  autoPlayWhenReached: false   // true = try to start when she reaches the section
}
```

Mobile browsers block audio until the person taps something. That's already handled —
the balloon tap counts as her first interaction, and the big play button does the rest.
If the file is missing, the player politely says so instead of failing silently.

## 6. Editing the Tamil poem

`config.js` → `poem.lines`. **One line of the poem = one item in the list.**
An empty string `""` leaves a blank line between stanzas.

```js
poem: {
  intro: "Words I wanted to tell you…",
  titleTamil: "சொல்ல நினைத்தது…",
  lines: [
    "உன் பெயரை நினைத்தால்",
    "மனசு மட்டும் சிரிக்கும்…",
    "",
    "மீதி வரிகள் இங்கே…"
  ],
  signature: "— உன்…"
}
```

Save the file as **UTF-8** (VS Code and Notepad do this by default) so Tamil renders
correctly. The site loads *Noto Serif Tamil* and falls back to the phone's own Tamil font.
The lines fade in one by one as she scrolls.

## 7. Editing the personal message

`config.js` → `letter`. Each item in `paragraphs` becomes its own paragraph, revealed
with a typewriter animation (she can tap the card to show it all at once).

```js
letter: {
  heading: "From my heart…",
  greeting: "Dear",
  paragraphs: [ "First paragraph…", "Second paragraph…" ],
  signOff: "Always yours,"
}
```

Also in `config.js`: her name, your name, the browser tab title, the opening line, the
birthday message, the photo captions, the "things I never said" lines, the song heading
and the final words. Everything.

## 8. Pushing to GitHub

```bash
cd birthday-surprise
git init
git add .
git commit -m "A birthday surprise"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

> Heads up: a public repo means the photos and the letter are public too.
> If you'd rather keep it private, make the repo **private** and deploy with Netlify or
> Vercel instead (both serve private repos on their free tier).

## 9. Deploying

**GitHub Pages** — Repo → **Settings** → **Pages** → Source: `Deploy from a branch`,
Branch: `main`, folder: `/ (root)` → **Save**.
A minute later it's live at `https://<your-username>.github.io/<your-repo>/`.

**Netlify** — drag the whole `birthday-surprise` folder onto
[app.netlify.com/drop](https://app.netlify.com/drop). Live in about ten seconds, and you
get a nicer link you can rename.

**Vercel / Cloudflare Pages** — import the repo, framework preset **Other**, no build
command, output directory `.`.

Before you send the link, open it once on your own phone over mobile data. That's the
real test.

---

## A few notes

- **Performance** — one `<canvas>` draws every heart, ∞ and sparkle from pre-rendered
  sprites, so the whole atmosphere costs a handful of `drawImage` calls per frame. Particle
  counts drop automatically on small screens, and everything pauses when the tab is hidden.
- **Reduced motion** — if her phone has "Reduce Motion" turned on, animations shorten and
  the letter appears instantly. Nothing breaks.
- **Calmer or richer?** `config.js` → `atmosphere.density` (`0.5` calm, `1` default,
  `1.5` richer) and `atmosphere.balloonCount` (`5`–`8` looks best).
- **Copyright** — the song file is yours to supply; no lyrics are reproduced anywhere on
  the page, only the title and credits.
