# MedTreat India Website

This repository contains the static website deployed at `www.medtreatindia.com`.

## Structure

- `medtreatindia-new-site/` contains the live HTML, CSS, JavaScript, and referenced assets.
- `medtreatindia-new-site/google-sheet-apps-script.js` contains the separately deployed Google Sheets enquiry backend.
- `scripts/build-static-site.js` copies the public website into `build/` and creates `sitemap.xml` and `robots.txt`.
- `vercel.json` contains the production deployment and security-header configuration.

## Build

Run:

```sh
npm run build
```

The generated `build/` folder is intentionally excluded from Git because Vercel creates it during deployment.
