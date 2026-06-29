# Camping Botușel Website

Static website for Camping Botușel in Fundu Moldovei, Bucovina.

The site is plain HTML, CSS, and JavaScript, hosted on Cloudflare Pages. Current pages:

- `index.html` - homepage
- `contact/` - contact page
- `contact.html` - compatibility redirect

## Local Preview

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Open `http://127.0.0.1:8766/index.html`.

## Checks

```powershell
npm run check
```

See `AGENTS.md` for the full Codex operating guide, source folders, deployment rules, and Cloudflare details.
