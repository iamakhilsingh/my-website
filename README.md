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

## Enquiry confirmation emails

The Google Apps Script backend validates each submitted email address, saves the enquiry to the `Responses` sheet, and emails the patient a copy of their submitted details. It sends from the Google account that owns the Apps Script deployment and uses `support@medtreatindia.com` as the reply-to address. If `support@medtreatindia.com` is configured as a Gmail sending alias, it is also used as the sender.

After changing `medtreatindia-new-site/google-sheet-apps-script.js`, update the code in the linked Google Sheet's Apps Script project and deploy a new web-app version. Keep the existing web-app URL so the endpoint in `script.js` continues to work.
