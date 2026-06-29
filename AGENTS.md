# Camping Botusel Website Codex Guide

This repository is the source of truth for the Camping Botusel static website.

## Project Facts

- Local repo path on Stefan's PC: `C:\Users\Stefan\Documents\Camping`
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

Do not edit DNS records in Zooku unless explicitly asked. Zooku should only point the domain to Cloudflare nameservers.

## Repository Layout

- `index.html` - main landing/coming-soon page
- `contact.html` - contact page
- `styles.css` - all visual styling and responsive rules
- `script.js` - mobile menu, reveal effects, and small interactions
- `assets/botusel-logo.svg` - logo asset
- `README.md` - short public project summary
- `README.txt` - original handoff/readme from the generated site folder
- `.gitignore` - local generated/cache exclusions

The site has no build step. It is plain static HTML/CSS/JS.

## Edit Workflow

1. Work from `C:\Users\Stefan\Documents\Camping`, not the old Desktop copy.
2. Check state first:

   ```powershell
   git status --short --branch
   ```

3. Make focused edits to the relevant file.
4. Test locally by opening `index.html` directly, or run a small local server if browser routing is needed:

   ```powershell
   python -m http.server 8080
   ```

   Then open `http://localhost:8080`.

5. Commit and push:

   ```powershell
   git add --all
   git commit -m "Describe the website change"
   git push
   ```

GitHub authentication on this PC is available through Git Credential Manager. `gh` may not be installed.

## Deploy Workflow

Cloudflare Pages was created by direct upload with Wrangler. GitHub pushes do not automatically deploy unless a future Codex connects the Pages project to GitHub.

After making changes, deploy from the repo root:

```powershell
npx wrangler pages deploy "C:\Users\Stefan\Documents\Camping" --project-name=camping-botusel --branch=main --commit-dirty=true --commit-message="Deploy Camping Botusel site"
```

Before deploying, confirm Wrangler auth:

```powershell
npx wrangler whoami
```

If not logged in, run:

```powershell
npx wrangler login
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

1. Check nameservers:

   ```powershell
   Resolve-DnsName -Server 1.1.1.1 -Name campingbotusel.com -Type NS
   ```

   Expected:

   ```txt
   addyson.ns.cloudflare.com
   porter.ns.cloudflare.com
   ```

2. Check live DNS:

   ```powershell
   Resolve-DnsName -Server 1.1.1.1 -Name campingbotusel.com -Type A
   Resolve-DnsName -Server 1.1.1.1 -Name www.campingbotusel.com -Type A
   ```

   Expected: Cloudflare IPs, not `80.92.65.214`.

3. Check Cloudflare Pages custom domains:

   ```powershell
   npx wrangler pages project list
   ```

   The project should be `camping-botusel`.

## Content Conventions

- Visible website text is Romanian.
- Keep the tone warm, clear, and local to Bucovina/Camping Botusel.
- Keep the site lightweight and static unless Stefan explicitly asks for backend features.
- Preserve mobile responsiveness.
- If adding images, keep them optimized and place them under `assets/`.
- Do not add trackers, analytics, paid services, or forms with external data collection unless Stefan explicitly asks.

## Contact Data

Current mail links from the original handoff:

- Reservations: `gratiela_smi@yahoo.com`
- Other questions: `tonegari.stefan@gmail.com`

Verify with Stefan before changing contact addresses.

## Common Tasks

### Update Text

- Edit `index.html` for main page copy.
- Edit `contact.html` for contact page copy.
- Keep diacritics valid in UTF-8.

### Update Styling

- Edit `styles.css`.
- Check desktop and mobile widths.
- Avoid visual changes that make the page feel like a generic SaaS landing page; this is a campsite site.

### Add Assets

- Place files under `assets/`.
- Reference them with relative paths such as `assets/example.jpg`.
- Keep filenames simple and web-safe.

### Publish A Finished Change

Run:

```powershell
git status --short --branch
git add --all
git commit -m "Update Camping Botusel website"
git push
npx wrangler pages deploy "C:\Users\Stefan\Documents\Camping" --project-name=camping-botusel --branch=main --commit-dirty=true --commit-message="Deploy Camping Botusel site"
```

Then verify:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri "https://campingbotusel.com" -TimeoutSec 30
Invoke-WebRequest -UseBasicParsing -Uri "https://www.campingbotusel.com" -TimeoutSec 30
```

Expected HTTP status: `200`.

## Historical Notes

- The original site folder came from `C:\Users\Stefan\Desktop\camping-botusel-website`.
- The clean repo source is now `C:\Users\Stefan\Documents\Camping`.
- The GitHub repo was created from this local source after the first Cloudflare deployment.
- Initial Cloudflare activation briefly showed old DNS IP `80.92.65.214`; this was corrected by keeping the Cloudflare CNAME records above.

