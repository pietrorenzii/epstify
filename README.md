# 🔲 EPSTIFY

> **Turn any document into an Epstein File in 3 seconds.**

Upload any PDF, image, or text. Download the officially classified version.
Because some things are better left ████████.

**[→ Try it live at epstify.com](https://epstify.com)**

---

## Features

- 📄 **Multi-format** — PDF, PNG, JPG, GIF, WEBP, TXT
- 🔲 **3 redaction levels** — Mild / Standard / Maximum (you know too much)
- 🔴 **4 stamp types** — CLASSIFIED, TOP SECRET, EYES ONLY, FBI
- ⬇️ **Download as PNG** — ready to post anywhere
- 𝕏 **Share on X** — pre-compiled tweet, one click
- 🎭 **Easter eggs** — try uploading files named `resume`, `epstein`, `password`
- 📊 **Live counter** — documents epstified today
- 🛡️ **100% client-side** — your files never leave your browser. Ever.

---

## Stack

```
HTML · CSS · Vanilla JS
PDF.js · html2canvas · jsPDF
GitHub Pages — zero cost, zero backend, zero server
```

---

## Run locally

```bash
git clone https://github.com/YOURUSERNAME/epstify
cd epstify
open index.html
```

Or with a local server:
```bash
npx serve .
```

---

## Deploy on GitHub Pages

1. Fork this repo
2. **Settings → Pages → Source: main / root**
3. Live at `https://YOURUSERNAME.github.io/epstify`

### Custom domain (epstify.com)

1. **Settings → Pages → Custom domain** → `epstify.com` → Save
2. Add these DNS records on your registrar:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  YOURUSERNAME.github.io
```

3. Wait 10-30 min → tick "Enforce HTTPS"

---

## Project structure

```
epstify/
├── index.html               ← entire app, single file
├── README.md                ← this file
├── LICENSE                  ← MIT
├── COPY.md                  ← all copy, tweets, launch strategy
├── CONTRIBUTING.md          ← how to contribute
├── CNAME                    ← custom domain for GitHub Pages
├── .gitignore               ← standard ignores
└── .github/
    └── workflows/
        └── deploy.yml       ← auto-deploy to GitHub Pages
```

---

## Roadmap

- [ ] Click a redaction bar → random conspiracy text appears
- [ ] Custom stamp text input
- [ ] Multi-page PDF support
- [ ] Telegram bot
- [ ] Browser extension

---

## Legal

Satirical meme tool. 100% client-side. No data leaves your browser.
Output is fictional and for entertainment only.
Not affiliated with any government agency or individual.

---

*Classified by order of ████████ | Declassified: Never | epstify.com*
