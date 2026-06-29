# Camping Botușel Website Codex Guide

This repository is the source of truth for the Camping Botușel static website.

## Current Project Facts

- Local repo path on Stefan's PC: `C:\Users\Stefan\Documents\Camping`
- Desktop source/reference folder: `C:\Users\Stefan\Desktop\Camping`
- GitHub repo: `https://github.com/artistul/camping-botusel-website`
- Cloudflare account: `Tonegari.stefan@gmail.com's Account`
- Cloudflare Pages project: `camping-botusel`
- Live domains:
  - `https://campingbotusel.com`
  - `https://www.campingbotusel.com`
- Cloudflare fallback URL: `https://camping-botusel.pages.dev`
- DNS provider: Cloudflare
- Registrar: Zooku
- Cloudflare nameservers:
  - `addyson.ns.cloudflare.com`
  - `porter.ns.cloudflare.com`

Do not edit DNS records in Zooku unless Stefan explicitly asks. Zooku should only point the domain to Cloudflare nameservers.

## Important Working Rule

When Stefan says to work locally, do not commit, push, or deploy. Make local edits, run local checks, and wait for explicit confirmation before any Git commit or Cloudflare upload.

## Reference Standard

The rebuild started on 2026-06-29 uses:

- `C:\Users\Stefan\Documents\Influx` as the 97/100 implementation and organization reference.
- `https://www.dji.com/global/power-2000` as the 99/100 homepage pacing reference.

Interpretation:

- DJI governs the homepage feeling: confident first viewport, full-bleed visual, minimal copy, strong product/showcase rhythm.
- InFlux governs the repo discipline: static site, direct assets, simple scripts, Playwright checks, clear routes, and future-Codex documentation.
- Camping Botușel branding governs tone: Bucovina, pines, canvas, warm wood, local Romanian copy, practical camping information.

Do not copy DJI content, code, or assets. Use it only as a quality and pacing reference.

## Repository Layout

- `index.html` - main homepage.
- `contact/index.html` - canonical contact page.
- `contact.html` - compatibility redirect to `contact/`.
- `styles.css` - all visual styling and responsive rules.
- `script.js` - mobile menu, reveal effects, section state, and scroll behavior.
- `assets/` - optimized web assets.
- `tests/website.spec.js` - Playwright responsive and asset smoke tests.
- `playwright.config.js` - local test server configuration.
- `scripts/check-website.ps1` - one-command local check script.
- `package.json` - local test scripts and Playwright dependency.
- `README.md` - short public project summary.
- `.gitignore` - local generated/cache exclusions.

The site has no production build step. It is plain static HTML/CSS/JS.

## Desktop Source Folder

Always inspect `C:\Users\Stefan\Desktop\Camping` before visual, content, or media-heavy changes.

Current observed source structure:

- `C:\Users\Stefan\Desktop\Camping\General Media\Branding`
  - `Full Logo Square.png`
  - `Full Logo Vertical.png`
  - `Social Media Banner No Logo.png`
  - `Social Media Banner.png`
  - `Social Media Profile Picture.png`
  - `Stamp.png`
- `C:\Users\Stefan\Desktop\Camping\General Media\In-Construction Campsite Building media`
  - WhatsApp construction photos and one MP4.
- `C:\Users\Stefan\Desktop\Camping\General Media\Nature shots`
  - nature/meadow photo used as the current hero source.
- `C:\Users\Stefan\Desktop\Camping\General Media\Promotional Materials`
  - PDF flyer/poster/sticker exports.

The current optimized repo assets created from that folder are:

- `assets/botusel-logo-full.webp`
- `assets/botusel-logo-square.webp`
- `assets/botusel-banner.webp`
- `assets/botusel-hero-meadow.webp`
- `assets/botusel-build-01.webp`
- `assets/botusel-build-02.webp`
- `assets/botusel-build-03.webp`
- `assets/botusel-build-04.webp`
- `assets/botusel-build-05.webp`
- `assets/botusel-build-06.webp`

If adding new images, place optimized web-safe files under `assets/` and keep the original source files on Desktop untouched.

## Content Rules

- Visible website text is Romanian.
- Keep the tone warm, clear, practical, and local to Bucovina.
- Do not invent prices, final amenities, opening dates, coordinates, rules, or capacity.
- Use "în pregătire" or similarly honest language when details are not confirmed.
- Contact data:
  - Reservations: `gratiela_smi@yahoo.com`
  - Other questions: `tonegari.stefan@gmail.com`
- Verify with Stefan before changing contact addresses.

## Visual Rules

- Use real Camping Botușel assets first.
- The homepage should feel like a premium product showcase, but with local campsite warmth.
- Keep the hero full-bleed and image-led.
- Avoid generic SaaS layout, generic stock imagery, heavy dark-blue/purple palettes, and decorative blobs.
- Use cards only for repeated information, contact options, or gallery/media items.
- Mobile must remain clean: no horizontal overflow, readable Romanian diacritics, and touch-friendly navigation.

## Local Development

From `C:\Users\Stefan\Documents\Camping`:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Then open:

```txt
http://127.0.0.1:8766/index.html
http://127.0.0.1:8766/contact/
```

## Local Tests

Run:

```powershell
npm run check
```

This installs local dependencies if needed and runs Playwright checks through `scripts/check-website.ps1`.

Direct test command:

```powershell
npm test
```

## Git Workflow

Check state first:

```powershell
git status --short --branch
```

Only after Stefan confirms:

```powershell
git add --all
git commit -m "Update Camping Botusel website"
git push
```

Do not commit generated Playwright reports or local caches.

## Deploy Workflow

Cloudflare Pages was created by direct upload with Wrangler. GitHub pushes do not automatically deploy unless a future Codex connects the Pages project to GitHub.

Only deploy after Stefan explicitly confirms:

```powershell
npx wrangler pages deploy "C:\Users\Stefan\Documents\Camping" --project-name=camping-botusel --branch=main --commit-dirty=true --commit-message="Deploy Camping Botusel site"
```

Before deploying, confirm Wrangler auth:

```powershell
npx wrangler whoami
```

Use the same Cloudflare account that manages `influxorigin.ro`.

## DNS And Domain Setup

Cloudflare DNS should contain only the needed web records unless email is added later:

```txt
CNAME  campingbotusel.com      camping-botusel.pages.dev  Proxied
CNAME  www.campingbotusel.com  camping-botusel.pages.dev  Proxied
```

Cloudflare uses CNAME flattening for the apex/root domain. Do not replace this with old Zooku/MyHost/EuroDNS IP records.

If the site stops loading:

```powershell
Resolve-DnsName -Server 1.1.1.1 -Name campingbotusel.com -Type NS
Resolve-DnsName -Server 1.1.1.1 -Name campingbotusel.com -Type A
Resolve-DnsName -Server 1.1.1.1 -Name www.campingbotusel.com -Type A
```

Expected nameservers:

```txt
addyson.ns.cloudflare.com
porter.ns.cloudflare.com
```

Expected web response after deployment: HTTP `200` from both `campingbotusel.com` and `www.campingbotusel.com`.
